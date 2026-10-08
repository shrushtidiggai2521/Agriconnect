package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.OrderPlaceRequestDTO;
import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.entity.*;
import com.agriconnect.backend.exception.CartNotFoundException;
import com.agriconnect.backend.exception.InsufficientStockException;
import com.agriconnect.backend.exception.OrderNotFoundException;
import com.agriconnect.backend.exception.ResourceNotFoundException;
import com.agriconnect.backend.mapper.OrderMapper;
import com.agriconnect.backend.repository.*;
import com.agriconnect.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final EnumSet<OrderStatus> CANCELLABLE_STATUSES =
            EnumSet.of(OrderStatus.PENDING_ACCEPTANCE, OrderStatus.CONFIRMED, OrderStatus.PACKING);
    private final OrderActionTokenRepository orderActionTokenRepository;

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public List<OrderResponseDTO> placeOrder(Long buyerId, OrderPlaceRequestDTO requestDTO) {
        System.out.println("🔥🔥🔥 NEW placeOrder() METHOD CALLED 🔥🔥🔥");
        Cart cart = cartRepository.findByBuyerId(buyerId)
                .orElseThrow(() -> new CartNotFoundException("Your cart is empty - add products before placing an order"));

        if (cart.getItems().isEmpty()) {
            throw new CartNotFoundException("Your cart is empty - add products before placing an order");
        }

        Address address = addressRepository.findByIdAndBuyerId(requestDTO.getAddressId(), buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", requestDTO.getAddressId()));

        // Re-validate stock at checkout time - it may have changed since items were added to the cart.
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (cartItem.getQuantity() > product.getQuantity()) {
                throw new InsufficientStockException(
                        "Only " + product.getQuantity() + " " + product.getUnit()
                                + " of '" + product.getName() + "' available in stock");
            }
        }

        // One Order per farmer represented in the cart.
        Map<User, List<CartItem>> itemsByFarmer = cart.getItems().stream()
                .collect(Collectors.groupingBy(ci -> ci.getProduct().getFarmer()));

        List<Order> createdOrders = new ArrayList<>();

        for (Map.Entry<User, List<CartItem>> entry : itemsByFarmer.entrySet()) {
            User farmer = entry.getKey();
            List<CartItem> farmerCartItems = entry.getValue();

            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal farmerTotal = BigDecimal.ZERO;

            for (CartItem cartItem : farmerCartItems) {
                OrderItem orderItem = OrderItem.builder()
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .unitPrice(cartItem.getPrice())
                        .subtotal(cartItem.getSubtotal())
                        .build();
                orderItems.add(orderItem);
                farmerTotal = farmerTotal.add(cartItem.getSubtotal());

                // Decrease stock now that the order is confirmed placed.
                Product product = cartItem.getProduct();
                product.setQuantity(product.getQuantity() - cartItem.getQuantity());
                productRepository.save(product);
            }

            Order order = Order.builder()
                    .orderNumber(generateOrderNumber())
                    .buyer(cart.getBuyer())
                    .farmer(farmer)
                    .totalAmount(farmerTotal)
                    .deliveryAddress(address)
                    .paymentStatus(PaymentStatus.PENDING)
                    .orderStatus(OrderStatus.PENDING_ACCEPTANCE)
                    .build();

            orderItems.forEach(item -> item.setOrder(order));
            order.setItems(orderItems);

            Order savedOrder = orderRepository.save(order);
            System.out.println("🔥 ORDER SAVED: " + savedOrder.getOrderNumber());
            createActionTokens(savedOrder);
            System.out.println("🔥 TOKENS CREATED");
            createdOrders.add(savedOrder);
        }

        // Checkout complete - empty the cart (orphanRemoval handles the row deletes).
        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);
        cartRepository.save(cart);

        return createdOrders.stream().map(orderMapper::toResponseDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getMyOrders(Long buyerId, Pageable pageable) {
        return orderRepository.findByBuyerId(buyerId, pageable)
                .map(orderMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long orderId, Long requesterId, Role requesterRole) {
        Order order = findOrderOrThrow(orderId);
        assertCanView(order, requesterId, requesterRole);
        return orderMapper.toResponseDto(order);
    }

    @Override
    @Transactional
    public OrderResponseDTO cancelOrder(Long orderId, Long buyerId) {
        Order order = findOrderOrThrow(orderId);

        if (!order.getBuyer().getId().equals(buyerId)) {
            throw new AccessDeniedException("You can only cancel your own orders");
        }
        if (!CANCELLABLE_STATUSES.contains(order.getOrderStatus())) {
            throw new IllegalStateException(
                    "Order cannot be cancelled once it is " + order.getOrderStatus());
        }

        restockItems(order);
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderMapper.toResponseDto(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getFarmerOrders(Long farmerId, Pageable pageable) {
        return orderRepository.findByFarmerId(farmerId, pageable)
                .map(orderMapper::toResponseDto);
    }

    @Override
    @Transactional
    public OrderResponseDTO acceptOrder(Long orderId, Long farmerId) {
        Order order = findOrderOwnedByFarmerOrThrow(orderId, farmerId);
        assertStatus(order, OrderStatus.PENDING_ACCEPTANCE, "accepted");
        order.setOrderStatus(OrderStatus.CONFIRMED);
        return orderMapper.toResponseDto(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponseDTO rejectOrder(Long orderId, Long farmerId) {
        Order order = findOrderOwnedByFarmerOrThrow(orderId, farmerId);
        assertStatus(order, OrderStatus.PENDING_ACCEPTANCE, "rejected");
        restockItems(order);
        order.setOrderStatus(OrderStatus.REJECTED);
        return orderMapper.toResponseDto(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponseDTO shipOrder(Long orderId, Long farmerId) {
        Order order = findOrderOwnedByFarmerOrThrow(orderId, farmerId);
        if (order.getOrderStatus() != OrderStatus.CONFIRMED && order.getOrderStatus() != OrderStatus.PACKING) {
            throw new IllegalStateException("Order must be confirmed before it can be shipped");
        }
        order.setOrderStatus(OrderStatus.SHIPPED);
        return orderMapper.toResponseDto(orderRepository.save(order));
    }

    private void createActionTokens(Order order) {

        String acceptToken = UUID.randomUUID().toString();
        String rejectToken = UUID.randomUUID().toString();

        OrderActionToken acceptAction = OrderActionToken.builder()
                .token(acceptToken)
                .order(order)
                .farmer(order.getFarmer())
                .action(TokenAction.ACCEPT)
                .used(false)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        OrderActionToken rejectAction = OrderActionToken.builder()
                .token(rejectToken)
                .order(order)
                .farmer(order.getFarmer())
                .action(TokenAction.REJECT)
                .used(false)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        orderActionTokenRepository.save(acceptAction);
        orderActionTokenRepository.save(rejectAction);

        printMockSms(order, acceptToken, rejectToken);
    }

    private void printMockSms(
            Order order,
            String acceptToken,
            String rejectToken) {

        String acceptLink =
                "http://localhost:5173/order/action?token=" + acceptToken;

        String rejectLink =
                "http://localhost:5173/order/action?token=" + rejectToken;

        System.out.println();
        System.out.println("========================================");
        System.out.println("          AGRICONNECT SMS");
        System.out.println("========================================");
        System.out.println("Farmer: " + order.getFarmer().getName());
        System.out.println("Order: " + order.getOrderNumber());
        System.out.println("Amount: ₹" + order.getTotalAmount());
        System.out.println();
        System.out.println("ACCEPT ORDER:");
        System.out.println(acceptLink);
        System.out.println();
        System.out.println("REJECT ORDER:");
        System.out.println(rejectLink);
        System.out.println("========================================");
        System.out.println();
    }

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------

    private Order findOrderOrThrow(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order", "id", orderId));
    }

    private Order findOrderOwnedByFarmerOrThrow(Long orderId, Long farmerId) {
        Order order = findOrderOrThrow(orderId);
        if (!order.getFarmer().getId().equals(farmerId)) {
            throw new AccessDeniedException("You can only manage your own orders");
        }
        return order;
    }

    private void assertCanView(Order order, Long requesterId, Role requesterRole) {
        boolean isOwningBuyer = requesterRole == Role.BUYER && order.getBuyer().getId().equals(requesterId);
        boolean isOwningFarmer = requesterRole == Role.FARMER && order.getFarmer().getId().equals(requesterId);
        if (!isOwningBuyer && !isOwningFarmer) {
            throw new AccessDeniedException("You do not have permission to view this order");
        }
    }

    private void assertStatus(Order order, OrderStatus required, String action) {
        if (order.getOrderStatus() != required) {
            throw new IllegalStateException(
                    "Only orders in " + required + " status can be " + action + " (current status: "
                            + order.getOrderStatus() + ")");
        }
    }

    private void restockItems(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }

    private String generateOrderNumber() {
        return "ORD-" + Instant.now().toEpochMilli() + "-" + ThreadLocalRandom.current().nextInt(1000, 9999);
    }
}