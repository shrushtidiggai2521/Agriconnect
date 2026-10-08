package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.CartItemRequestDTO;
import com.agriconnect.backend.dto.CartResponseDTO;
import com.agriconnect.backend.dto.CartUpdateRequestDTO;
import com.agriconnect.backend.entity.Cart;
import com.agriconnect.backend.entity.CartItem;
import com.agriconnect.backend.entity.Product;
import com.agriconnect.backend.entity.User;
import com.agriconnect.backend.exception.CartNotFoundException;
import com.agriconnect.backend.exception.InsufficientStockException;
import com.agriconnect.backend.exception.ResourceNotFoundException;
import com.agriconnect.backend.mapper.CartMapper;
import com.agriconnect.backend.repository.CartItemRepository;
import com.agriconnect.backend.repository.CartRepository;
import com.agriconnect.backend.repository.ProductRepository;
import com.agriconnect.backend.repository.UserRepository;
import com.agriconnect.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponseDTO addItemToCart(Long buyerId, Long productId, CartItemRequestDTO requestDTO) {
        Cart cart = getOrCreateCart(buyerId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        assertAvailable(product);

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        int requestedTotalQuantity = requestDTO.getQuantity() + (existingItem != null ? existingItem.getQuantity() : 0);
        assertWithinStock(product, requestedTotalQuantity);

        BigDecimal currentUnitPrice = product.getPrice();

        if (existingItem == null) {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(requestDTO.getQuantity())
                    .price(currentUnitPrice)
                    .subtotal(currentUnitPrice.multiply(BigDecimal.valueOf(requestDTO.getQuantity())))
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        } else {
            existingItem.setQuantity(requestedTotalQuantity);
            existingItem.setPrice(currentUnitPrice); // refresh to the current price
            existingItem.setSubtotal(currentUnitPrice.multiply(BigDecimal.valueOf(requestedTotalQuantity)));
        }

        recalculateTotal(cart);
        return cartMapper.toResponseDto(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponseDTO updateCartItem(Long buyerId, CartUpdateRequestDTO requestDTO) {
        Cart cart = getExistingCartOrThrow(buyerId);

        CartItem item = cartItemRepository.findByIdAndCartId(requestDTO.getCartItemId(), cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", requestDTO.getCartItemId()));

        Product product = item.getProduct();
        assertAvailable(product);
        assertWithinStock(product, requestDTO.getQuantity());

        item.setQuantity(requestDTO.getQuantity());
        item.setPrice(product.getPrice());
        item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(requestDTO.getQuantity())));

        recalculateTotal(cart);
        return cartMapper.toResponseDto(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponseDTO removeCartItem(Long buyerId, Long cartItemId) {
        Cart cart = getExistingCartOrThrow(buyerId);

        CartItem item = cartItemRepository.findByIdAndCartId(cartItemId, cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        // orphanRemoval=true on Cart.items deletes the row on flush - no explicit repository.delete needed.
        cart.getItems().remove(item);

        recalculateTotal(cart);
        return cartMapper.toResponseDto(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponseDTO clearCart(Long buyerId) {
        Cart cart = getExistingCartOrThrow(buyerId);

        cart.getItems().clear();
        recalculateTotal(cart);

        return cartMapper.toResponseDto(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponseDTO getCart(Long buyerId) {
        Cart cart = getOrCreateCart(buyerId);
        return cartMapper.toResponseDto(cart);
    }

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------

    private Cart getOrCreateCart(Long buyerId) {
        return cartRepository.findByBuyerId(buyerId)
                .orElseGet(() -> {
                    User buyer = userRepository.findById(buyerId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", buyerId));
                    Cart newCart = Cart.builder()
                            .buyer(buyer)
                            .totalPrice(BigDecimal.ZERO)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private Cart getExistingCartOrThrow(Long buyerId) {
        return cartRepository.findByBuyerId(buyerId)
                .orElseThrow(() -> new CartNotFoundException(
                        "No cart found for this buyer yet - add a product to the cart first"));
    }

    private void assertAvailable(Product product) {
        if (product.getQuantity() == null || product.getQuantity() <= 0) {
            throw new InsufficientStockException(
                    "Product '" + product.getName() + "' is currently unavailable");
        }
    }

    private void assertWithinStock(Product product, int requestedQuantity) {
        if (requestedQuantity > product.getQuantity()) {
            throw new InsufficientStockException(
                    "Only " + product.getQuantity() + " " + product.getUnit()
                            + " of '" + product.getName() + "' available in stock");
        }
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
    }
}
