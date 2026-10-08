package com.agriconnect.backend.exception;

/**
 * Thrown when an operation would violate a uniqueness constraint,
 * e.g. registering a User with an email that already exists.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s already exists with %s : '%s'", resourceName, fieldName, fieldValue));
    }
}
