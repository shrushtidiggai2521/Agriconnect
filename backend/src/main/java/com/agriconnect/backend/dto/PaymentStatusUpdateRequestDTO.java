package com.agriconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload for the "gateway callback" simulator endpoints
 * ({@code POST /api/payments/success} / {@code /failure}). In a real
 * integration this shape would come from the gateway's webhook instead.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusUpdateRequestDTO {

    @NotBlank(message = "Payment id is required")
    private String paymentId;
}