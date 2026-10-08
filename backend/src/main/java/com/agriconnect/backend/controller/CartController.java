package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.CartItemRequestDTO;
import com.agriconnect.backend.dto.CartResponseDTO;
import com.agriconnect.backend.dto.CartUpdateRequestDTO;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.CartService;
import com.agriconnect.backend.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Shopping cart endpoints - BUYER role only (a farmer's own products don't
 * belong in a cart, and admins manage the marketplace, not shop in it).
 * <p>
 * NOTE: mounted at {@code /api/cart} rather than the bare {@code /cart} shown
 * in the spec, to stay consistent with every other module in this codebase
 * ({@code /api/users}, {@code /api/products}, {@code /api/auth}, ...).
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUYER')")
@Tag(name = "Cart Management", description = "Buyer shopping cart APIs")
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Add a product to the cart (creates the cart on first use)")
    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse<CartResponseDTO>> addToCart(
            @PathVariable Long productId,
            @Valid @RequestBody CartItemRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        CartResponseDTO cart = cartService.addItemToCart(principal.getId(), productId, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Product added to cart", cart));
    }

    @Operation(summary = "Update the quantity of an existing cart item")
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponseDTO>> updateCartItem(
            @Valid @RequestBody CartUpdateRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        CartResponseDTO cart = cartService.updateCartItem(principal.getId(), requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @Operation(summary = "Remove a single item from the cart")
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponseDTO>> removeCartItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal UserPrincipal principal) {
        CartResponseDTO cart = cartService.removeCartItem(principal.getId(), cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @Operation(summary = "Clear all items from the cart")
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartResponseDTO>> clearCart(
            @AuthenticationPrincipal UserPrincipal principal) {
        CartResponseDTO cart = cartService.clearCart(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }

    @Operation(summary = "Get the current buyer's cart")
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponseDTO>> getCart(
            @AuthenticationPrincipal UserPrincipal principal) {
        CartResponseDTO cart = cartService.getCart(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", cart));
    }
}
