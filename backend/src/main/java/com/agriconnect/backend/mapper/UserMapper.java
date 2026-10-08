package com.agriconnect.backend.mapper;

import com.agriconnect.backend.dto.UserRequestDTO;
import com.agriconnect.backend.dto.UserResponseDTO;
import com.agriconnect.backend.dto.UserUpdateDTO;
import com.agriconnect.backend.entity.User;
import org.springframework.stereotype.Component;

/**
 * Maps between {@link User} entity and its DTOs.
 * Kept as a plain component (no MapStruct) to avoid extra build tooling for the hackathon,
 * while still isolating mapping logic away from the service layer.
 */
@Component
public class UserMapper {

    /**
     * Converts a creation request DTO into a new entity.
     * NOTE: caller is responsible for setting the (already hashed) password separately.
     */
    public User toEntity(UserRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .role(dto.getRole())
                .location(dto.getLocation())
                .build();
    }

    /**
     * Applies an update DTO onto an existing managed entity in place.
     * Password is intentionally handled separately by the service layer.
     */
    public void updateEntityFromDto(UserUpdateDTO dto, User user) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        user.setLocation(dto.getLocation());
    }

    public UserResponseDTO toResponseDto(User user) {
        if (user == null) {
            return null;
        }
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .location(user.getLocation())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
