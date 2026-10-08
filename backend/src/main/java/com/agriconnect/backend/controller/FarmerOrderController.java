package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.OrderService;
import com.agriconnect.backend.util.ApiResponse;
import com.agriconnect.backend.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Farmer-facing order management: view incoming orders and move them through
 * their lifecycle (accept / reject / ship). FARMER role only.
 */
@RestController
@RequestMapping("/api/farmer/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
@Tag(name = "Order Management (Farmer)", description = "Farmer-side order review and fulfillment")
public class FarmerOrderController {

    private final OrderService orderService;

    @Operation(summary = "Get orders placed against this farmer's products (paginated)")
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponseDTO>>> getFarmerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderedAt").descending());
        Page<OrderResponseDTO> orders = orderService.getFarmerOrders(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", PagedResponse.from(orders)));
    }

    @Operation(summary = "Accept a newly placed order")
    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> acceptOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderResponseDTO order = orderService.acceptOrder(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Order accepted", order));
    }

    @Operation(summary = "Reject a newly placed order (stock is restored)")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> rejectOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderResponseDTO order = orderService.rejectOrder(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Order rejected", order));
    }

    @Operation(summary = "Mark an accepted order as shipped")
    @PutMapping("/{id}/ship")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> shipOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        OrderResponseDTO order = orderService.shipOrder(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Order marked as shipped", order));
    }
}