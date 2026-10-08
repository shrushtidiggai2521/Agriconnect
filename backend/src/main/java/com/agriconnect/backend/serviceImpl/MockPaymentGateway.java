package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.PaymentGatewayRequest;
import com.agriconnect.backend.dto.PaymentGatewayResponse;
import com.agriconnect.backend.service.PaymentGateway;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Stand-in for a real payment gateway (e.g. Razorpay). Randomly returns
 * success/failure so the checkout flow can be demoed end-to-end without any
 * external integration. Replace with a real {@link PaymentGateway}
 * implementation when one is available - {@code PaymentServiceImpl} doesn't
 * need to change either way.
 */
@Service
public class MockPaymentGateway implements PaymentGateway {

    private static final double SUCCESS_RATE = 0.8; // 80% of mock charges "succeed"

    @Override
    public PaymentGatewayResponse charge(PaymentGatewayRequest request) {
        boolean success = ThreadLocalRandom.current().nextDouble() < SUCCESS_RATE;

        if (success) {
            return PaymentGatewayResponse.builder()
                    .success(true)
                    .transactionId("MOCK-TXN-" + UUID.randomUUID())
                    .message("Payment processed successfully")
                    .build();
        }

        return PaymentGatewayResponse.builder()
                .success(false)
                .transactionId(null)
                .message("Payment declined by mock gateway")
                .build();
    }
}