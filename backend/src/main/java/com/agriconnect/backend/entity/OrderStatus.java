package com.agriconnect.backend.entity;

public enum OrderStatus {
    PENDING_ACCEPTANCE,
    CONFIRMED,
    PACKING,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    REJECTED
}