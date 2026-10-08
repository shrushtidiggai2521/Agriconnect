package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.FarmerProfileDto;
import com.agriconnect.backend.dto.FarmerSummaryDto;
import com.agriconnect.backend.dto.UpdateFarmerProfileRequest;

import java.util.List;

public interface FarmerService {

    /** Backs GET /api/farmers — every user with role FARMER. */
    List<FarmerSummaryDto> getAllFarmers();

    /** Backs GET /api/farmers/{id}. Throws FarmerNotFoundException if absent. */
    FarmerProfileDto getFarmerById(Long id);

    /** Backs PUT /api/farmers/me — a farmer editing their own profile. */
    FarmerProfileDto updateOwnProfile(Long userId, UpdateFarmerProfileRequest request);
}
