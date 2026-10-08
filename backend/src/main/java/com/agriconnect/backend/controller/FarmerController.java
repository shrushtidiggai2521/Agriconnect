package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.FarmerProfileDto;
import com.agriconnect.backend.dto.FarmerSummaryDto;
import com.agriconnect.backend.dto.UpdateFarmerProfileRequest;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.FarmerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public farmer discovery + profile endpoints.
 * GET endpoints are intentionally unauthenticated (buyers browse without
 * logging in) — adjust your SecurityConfig to permit GET /api/farmers/**
 * if your default is "deny all" (see notes at the end of this response).
 */
@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerService farmerService;

    @GetMapping
    public ResponseEntity<List<FarmerSummaryDto>> getAllFarmers() {
        return ResponseEntity.ok(farmerService.getAllFarmers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmerProfileDto> getFarmerById(@PathVariable Long id) {
        return ResponseEntity.ok(farmerService.getFarmerById(id));
    }

    /**
     * A farmer updating their own profile. Adjust @AuthenticationPrincipal's
     * type to whatever your JWT filter actually injects (a UserDetails
     * implementation, a custom Principal, etc.) — this assumes it exposes
     * getId(). If yours is different, swap this line for however you
     * currently extract the authenticated user's id elsewhere in the app.
     */
    @PutMapping("/me")
    public ResponseEntity<FarmerProfileDto> updateOwnProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateFarmerProfileRequest request
    ) {
        return ResponseEntity.ok(farmerService.updateOwnProfile(principal.getId(), request));
    }
}
