package com.agriconnect.backend.exception;

/**
 * Thrown when a requested quantity (adding to cart, updating a cart item,
 * or later placing an order) exceeds a product's available stock, or when
 * the product has zero stock and is therefore unavailable entirely.
 */
public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(String message) {
        super(message);
    }
}
