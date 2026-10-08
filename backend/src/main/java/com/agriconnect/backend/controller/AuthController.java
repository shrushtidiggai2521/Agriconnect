package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.LoginRequest;
import com.agriconnect.backend.dto.LoginResponse;
import com.agriconnect.backend.dto.RegisterRequest;
import com.agriconnect.backend.service.AuthenticationService;
import com.agriconnect.backend.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public authentication endpoints. Both are explicitly whitelisted in
 * {@link com.agriconnect.backend.config.SecurityConfig} - no JWT required to reach them.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and log in to obtain a JWT")
public class AuthController {

    private final AuthenticationService authenticationService;

    @Operation(summary = "Register a new user and receive a JWT")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authenticationService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @Operation(summary = "Log in with email and password to receive a JWT")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authenticationService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
