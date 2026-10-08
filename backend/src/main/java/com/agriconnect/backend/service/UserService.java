package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.UserRequestDTO;
import com.agriconnect.backend.dto.UserResponseDTO;
import com.agriconnect.backend.dto.UserUpdateDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO createUser(UserRequestDTO requestDTO);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO getMyProfile(Long userId);

    UserResponseDTO updateUser(Long id, UserUpdateDTO updateDTO);

    void deleteUser(Long id);
}
