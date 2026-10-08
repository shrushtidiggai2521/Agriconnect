package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.AddressRequestDTO;
import com.agriconnect.backend.dto.AddressResponseDTO;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.AddressService;
import com.agriconnect.backend.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Saved delivery addresses - BUYER role only.
 */
@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUYER')")
@Tag(name = "Address Management", description = "Buyer saved delivery addresses")
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Save a new address")
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponseDTO>> createAddress(
            @Valid @RequestBody AddressRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        AddressResponseDTO created = addressService.createAddress(principal.getId(), requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address saved successfully", created));
    }

    @Operation(summary = "Get all saved addresses")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponseDTO>>> getAddresses(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<AddressResponseDTO> addresses = addressService.getAddresses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Addresses fetched successfully", addresses));
    }

    @Operation(summary = "Get a single saved address by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponseDTO>> getAddressById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        AddressResponseDTO address = addressService.getAddressById(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Address fetched successfully", address));
    }

    @Operation(summary = "Update a saved address")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponseDTO>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        AddressResponseDTO updated = addressService.updateAddress(principal.getId(), id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @Operation(summary = "Delete a saved address")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        addressService.deleteAddress(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully"));
    }
}