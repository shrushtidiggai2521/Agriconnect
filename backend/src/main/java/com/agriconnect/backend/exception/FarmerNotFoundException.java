package com.agriconnect.backend.exception;

/**
 * Thrown when a farmer id doesn't exist, or exists but isn't role FARMER.
 *
 * NOTE: I don't have visibility into your existing exception hierarchy
 * (whether you have a base ApiException / NotFoundException that other
 * modules extend). If you do, change `extends RuntimeException` below to
 * extend that instead, so this plugs into your existing
 * @ControllerAdvice / GlobalExceptionHandler the same way every other
 * "not found" exception in your app already does. If this ends up being
 * your first custom exception, the standalone RuntimeException below is
 * fine as-is — just wire the handler snippet at the bottom of this file's
 * sibling notes into your @ControllerAdvice.
 */
public class FarmerNotFoundException extends RuntimeException {

    public FarmerNotFoundException(Long farmerId) {
        super("Farmer not found with id: " + farmerId);
    }

    public FarmerNotFoundException(String message) {
        super(message);
    }
}
