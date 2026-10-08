package com.agriconnect.backend.dto;

import com.agriconnect.backend.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Payload for POST /api/auth/register.
 * Mirrors {@link UserRequestDTO} - kept separate (per the auth module's own
 * contract) so the two endpoints can evolve independently, e.g. if
 * registration later needs an OTP field or a terms-accepted flag that plain
 * admin-created users (POST /api/users) don't.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit number")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).*$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;
}
