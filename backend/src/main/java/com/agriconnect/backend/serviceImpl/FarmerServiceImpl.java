package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.FarmerProfileDto;
import com.agriconnect.backend.dto.FarmerSummaryDto;
import com.agriconnect.backend.dto.UpdateFarmerProfileRequest;
import com.agriconnect.backend.entity.FarmerProfile;
import com.agriconnect.backend.exception.FarmerNotFoundException;
import com.agriconnect.backend.mapper.FarmerMapper;
import com.agriconnect.backend.entity.Role;             // adjust import to your actual Role enum
import com.agriconnect.backend.entity.User;              // adjust import to your actual User entity
import com.agriconnect.backend.repository.FarmerProfileRepository;
import com.agriconnect.backend.repository.UserRepository;    // adjust import to your actual repo
import com.agriconnect.backend.repository.ProductRepository; // adjust import to your actual repo
import com.agriconnect.backend.service.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FarmerServiceImpl implements FarmerService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final FarmerMapper farmerMapper;

    @Override
    public List<FarmerSummaryDto> getAllFarmers() {
        return userRepository.findByRole(Role.FARMER)
                .stream()
                .map(this::toSummaryDto)
                .toList();
    }

    @Override
    public FarmerProfileDto getFarmerById(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> u.getRole() == Role.FARMER)
                .orElseThrow(() -> new FarmerNotFoundException(id));

        FarmerProfile profile = farmerProfileRepository.findByUserId(id).orElse(null);
        long productCount = productRepository.countByFarmerId(id);


        return farmerMapper.toProfileDto(user, profile, productCount);
    }

    @Override
    @Transactional
    public FarmerProfileDto updateOwnProfile(Long userId, UpdateFarmerProfileRequest request) {
        User user = userRepository.findById(userId)
                .filter(u -> u.getRole() == Role.FARMER)
                .orElseThrow(() -> new FarmerNotFoundException(userId));

        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseGet(() -> FarmerProfile.builder().user(user).build());

        if (request.bio() != null) profile.setBio(request.bio());
        if (request.profileImageUrl() != null) profile.setProfileImageUrl(request.profileImageUrl());
        if (request.location() != null) profile.setLocation(request.location());

        farmerProfileRepository.save(profile);
        return getFarmerById(userId);
    }

    private FarmerSummaryDto toSummaryDto(User user) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(user.getId()).orElse(null);
        long productCount = productRepository.countByFarmerId(user.getId());


        return farmerMapper.toSummaryDto(user, profile, productCount);
    }
}
