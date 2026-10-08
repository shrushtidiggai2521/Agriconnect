package com.agriconnect.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Response body returned when Jakarta Bean Validation (@Valid) fails on a request DTO.
 * Field-level messages are collected into {@code errors} so the client can highlight
 * exactly which inputs are invalid.
 *
 * <pre>
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": {
 *     "email": "Email must be valid",
 *     "phone": "Phone number must be 10 digits"
 *   },
 *   "timestamp": "2026-08-03T10:15:30"
 * }
 * </pre>
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {

    private boolean success;
    private String message;
    private Map<String, String> errors;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
