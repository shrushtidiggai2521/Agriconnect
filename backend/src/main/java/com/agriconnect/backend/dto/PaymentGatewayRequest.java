package com.agriconnect.backend.dto;

import com.agriconnect.backend.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Internal request passed from {@code PaymentService} to a {@code PaymentGateway}
 * implementation. Not exposed directly as a REST payload - deliberately gateway-agnostic
 * so swapping {@code MockPaymentGateway} for a real one (e.g. Razorpay) later doesn't
 * touch the business logic that builds this object.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentGatewayRequest {

    private String paymentId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
}