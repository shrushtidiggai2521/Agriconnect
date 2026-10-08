package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.PaymentCreateRequestDTO;
import com.agriconnect.backend.dto.PaymentResponseDTO;
import com.agriconnect.backend.dto.PaymentStatusUpdateRequestDTO;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.PaymentService;
import com.agriconnect.backend.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Payment endpoints. {@code create}/{@code success}/{@code failure} are BUYER-only
 * (only the person paying can initiate or confirm a payment); the {@code GET} lookup
 * is open to either the buyer or the farmer on that order.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "Order payment processing (mock gateway)")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Create and synchronously charge a payment for an order")
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> createPayment(
            @Valid @RequestBody PaymentCreateRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        PaymentResponseDTO payment = paymentService.createPayment(principal.getId(), requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment successful", payment));
    }

    @Operation(summary = "Manually mark a payment attempt as successful (simulated gateway callback)")
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/success")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> markSuccess(
            @Valid @RequestBody PaymentStatusUpdateRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        PaymentResponseDTO payment = paymentService.markPaymentSuccess(principal.getId(), requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Payment marked as successful", payment));
    }

    @Operation(summary = "Manually mark a payment attempt as failed (simulated gateway callback)")
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/failure")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> markFailure(
            @Valid @RequestBody PaymentStatusUpdateRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        PaymentResponseDTO payment = paymentService.markPaymentFailure(principal.getId(), requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Payment marked as failed", payment));
    }

    @Operation(summary = "Get the most recent payment attempt for an order")
    @PreAuthorize("hasRole('BUYER') or hasRole('FARMER')")
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPaymentForOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal) {
        PaymentResponseDTO payment = paymentService.getPaymentForOrder(orderId, principal.getId(), principal.getRole());
        return ResponseEntity.ok(ApiResponse.success("Payment fetched successfully", payment));
    }
}