package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.CartItemRequestDTO;
import com.agriconnect.backend.dto.CartResponseDTO;
import com.agriconnect.backend.dto.CartUpdateRequestDTO;

public interface CartService {

    CartResponseDTO addItemToCart(Long buyerId, Long productId, CartItemRequestDTO requestDTO);

    CartResponseDTO updateCartItem(Long buyerId, CartUpdateRequestDTO requestDTO);

    CartResponseDTO removeCartItem(Long buyerId, Long cartItemId);

    CartResponseDTO clearCart(Long buyerId);

    CartResponseDTO getCart(Long buyerId);
}
