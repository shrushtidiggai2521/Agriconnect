package com.agriconnect.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Provides a {@link PasswordEncoder} bean for hashing user passwords.
 * <p>
 * Uses {@code spring-security-crypto} directly (not the full Spring Security
 * starter), so endpoints remain open for Phase 1 while passwords are still
 * stored safely, hashed with BCrypt.
 */
@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
