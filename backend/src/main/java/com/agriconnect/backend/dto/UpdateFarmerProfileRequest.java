package com.agriconnect.backend.dto;

import jakarta.validation.constraints.Size;

/**
 * Body for PUT /api/farmers/me (farmer editing their own profile).
 * All fields optional — only non-null fields are applied by the service.
 */
public record UpdateFarmerProfileRequest(
        @Size(max = 1000, message = "Bio must be under 1000 characters") String bio,
        String profileImageUrl,
        String location
) {}
