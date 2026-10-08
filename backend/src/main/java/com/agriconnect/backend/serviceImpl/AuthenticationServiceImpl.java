package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.LoginRequest;
import com.agriconnect.backend.dto.LoginResponse;
import com.agriconnect.backend.dto.RegisterRequest;
import com.agriconnect.backend.entity.User;
import com.agriconnect.backend.exception.DuplicateResourceException;
import com.agriconnect.backend.exception.ResourceNotFoundException;
import com.agriconnect.backend.mapper.UserMapper;
import com.agriconnect.backend.repository.UserRepository;
import com.agriconnect.backend.security.JwtService;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implements registration and login on top of the EXISTING {@link User} entity
 * and {@link UserRepository} - no parallel "auth user" model is introduced.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword())) // always BCrypt-hashed
                .role(request.getRole())
                .location(request.getLocation())
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(new UserPrincipal(savedUser));
        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userMapper.toResponseDto(savedUser))
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Delegates to CustomUserDetailsService + the DaoAuthenticationProvider configured
        // in SecurityConfig. Throws BadCredentialsException (handled by GlobalExceptionHandler)
        // if the email doesn't exist or the password doesn't match the BCrypt hash.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String token = jwtService.generateToken(new UserPrincipal(user));
        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userMapper.toResponseDto(user))
                .build();
    }
}
