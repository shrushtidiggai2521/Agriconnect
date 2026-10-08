package com.agriconnect.backend.exception;

/**
 * Thrown when a requested resource (User, Product, Scheme, Supplier, MarketPrice, ...)
 * cannot be found by its identifier or lookup key.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }
}
