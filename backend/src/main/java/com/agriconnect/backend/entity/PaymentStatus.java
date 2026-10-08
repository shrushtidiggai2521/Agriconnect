package com.agriconnect.backend.entity;

/**
 * Shared by both {@link Order} (the order's overall payment state) and
 * {@link Payment} (a single payment attempt's outcome) - one enum, one
 * source of truth for what "paid" means across the app.
 */
public enum PaymentStatus {
    PENDING,
    PAID,
    FAILED,
    REFUNDED
}