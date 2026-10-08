package com.agriconnect.backend.dto;

/**
 * Used by GET /api/farmers (the discovery grid).
 * Any field can be null — the frontend already renders conditionally
 * ("ONLY IF THE DATA EXISTS"), so don't fake values here either.
 */
public record FarmerSummaryDto(
        Long id,
        String name,
        String location,
        String bio,
        String profileImageUrl,
        Double ratingAverage,
        Integer ratingCount,
        long productCount

) {}
