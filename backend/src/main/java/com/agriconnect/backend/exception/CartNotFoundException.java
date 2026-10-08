package com.agriconnect.backend.exception;

/**
 * Thrown when an operation (update/remove/clear) is attempted on a buyer's
 * cart before it exists - i.e. the buyer has never added a product yet.
 * <p>
 * NOTE: {@code GET /api/cart} and {@code POST /api/cart/add/{productId}}
 * auto-create the cart on first use, so this is only ever thrown by the
 * "the cart must already exist" operations.
 */
public class CartNotFoundException extends RuntimeException {

    public CartNotFoundException(String message) {
        super(message);
    }
}
