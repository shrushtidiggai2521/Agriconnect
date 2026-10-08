package com.agriconnect.backend.exception;

/**
 * Thrown when a payment gateway charge attempt (via {@code POST /api/payments/create})
 * comes back unsuccessful. The failed {@code Payment} row is still persisted for
 * audit/retry purposes before this is thrown - see
 * {@code PaymentServiceImpl#createPayment} for the {@code noRollbackFor} detail.
 */
public class PaymentFailedException extends RuntimeException {

    public PaymentFailedException(String message) {
        super(message);
    }
}