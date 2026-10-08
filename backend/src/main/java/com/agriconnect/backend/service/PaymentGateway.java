package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.PaymentGatewayRequest;
import com.agriconnect.backend.dto.PaymentGatewayResponse;

/**
 * Abstraction over whatever payment gateway actually processes a charge.
 * {@code PaymentServiceImpl} depends only on this interface, never on a
 * concrete gateway - so a real integration (Razorpay, Stripe, ...) can be
 * plugged in later just by adding a new {@code @Service} implementation and
 * marking it {@code @Primary} (or swapping the {@code @Qualifier}), with zero
 * changes to the business logic in {@code PaymentServiceImpl}.
 * <p>
 * For now, {@code MockPaymentGateway} is the only implementation.
 */
public interface PaymentGateway {

    PaymentGatewayResponse charge(PaymentGatewayRequest request);
}