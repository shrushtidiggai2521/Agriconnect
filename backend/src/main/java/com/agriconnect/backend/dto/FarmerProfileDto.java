package com.agriconnect.backend.dto;

import java.time.Instant;

/**
 * Used by GET /api/farmers/{id} (the public profile page).
 * Superset of FarmerSummaryDto — includes joinedAt.
 */
public record FarmerProfileDto(
        Long id,
        String name,
        String location,
        String bio,
        String profileImageUrl,
        Double ratingAverage,
        Integer ratingCount,
        long productCount,
        Instant joinedAt
) {}
