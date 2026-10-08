package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.OrderPlaceRequestDTO;
import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.OrderService;
import com.agriconnect.backend.util.ApiResponse;
import com.agriconnect.backend.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Buyer-facing order endpoints: checkout, order history, and single-order lookup.
 * Farmer-facing order management lives in {@link FarmerOrderController}.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management (Buyer)", description = "Checkout, order history, and order detail")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Place an order from the current cart (splits per farmer if needed)")
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/place")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> placeOrder(
            @Valid @RequestBody OrderPlaceRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<OrderResponseDTO> orders = orderService.placeOrder(principal.getId(), requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", orders));
    }

    @Operation(summary = "Get the buyer's own order history (paginated)")
    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponseDTO>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderedAt").descending());
        Page<OrderResponseDTO> orders = orderService.getMyOrders(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", PagedResponse.from(orders)));
    }

    @Operation(summary = "Get a single order (the buyer or the farmer on that order may view it)")
    @PreAuthorize("hasRole('BUYER') or hasRole('FARMER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderResponseDTO order = orderService.getOrderById(id, principal.getId(), principal.getRole());
        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", order));
    }

    @Operation(summary = "Cancel an order (only while it hasn't shipped yet)")
    @PreAuthorize("hasRole('BUYER')")
    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderResponseDTO order = orderService.cancelOrder(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }
}