package com.agriconnect.backend.mapper;

import com.agriconnect.backend.dto.CartItemResponseDTO;
import com.agriconnect.backend.dto.CartResponseDTO;
import com.agriconnect.backend.entity.Cart;
import com.agriconnect.backend.entity.CartItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartMapper {

    public CartItemResponseDTO toItemResponseDto(CartItem item) {
        if (item == null) {
            return null;
        }
        return CartItemResponseDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .unit(item.getProduct().getUnit())
                .imageUrl(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    public CartResponseDTO toResponseDto(Cart cart) {
        if (cart == null) {
            return null;
        }

        List<CartItemResponseDTO> items = cart.getItems().stream()
                .map(this::toItemResponseDto)
                .toList();

        return CartResponseDTO.builder()
                .id(cart.getId())
                .buyerId(cart.getBuyer().getId())
                .items(items)
                .totalPrice(cart.getTotalPrice())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}
