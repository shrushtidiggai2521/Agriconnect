package com.agriconnect.backend.mapper;

import com.agriconnect.backend.dto.OrderItemResponseDTO;
import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.entity.Order;
import com.agriconnect.backend.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    private final AddressMapper addressMapper;

    public OrderMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public OrderItemResponseDTO toItemResponseDto(OrderItem item) {
        if (item == null) {
            return null;
        }
        return OrderItemResponseDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    public OrderResponseDTO toResponseDto(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemResponseDTO> items = order.getItems().stream()
                .map(this::toItemResponseDto)
                .toList();

        return OrderResponseDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getName())
                .farmerId(order.getFarmer().getId())
                .farmerName(order.getFarmer().getName())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(addressMapper.toResponseDto(order.getDeliveryAddress()))
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .orderedAt(order.getOrderedAt())
                .build();
    }
}