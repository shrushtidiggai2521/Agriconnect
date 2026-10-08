package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.AddressRequestDTO;
import com.agriconnect.backend.dto.AddressResponseDTO;
import com.agriconnect.backend.entity.Address;
import com.agriconnect.backend.entity.User;
import com.agriconnect.backend.exception.ResourceNotFoundException;
import com.agriconnect.backend.mapper.AddressMapper;
import com.agriconnect.backend.repository.AddressRepository;
import com.agriconnect.backend.repository.UserRepository;
import com.agriconnect.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public AddressResponseDTO createAddress(Long buyerId, AddressRequestDTO requestDTO) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", buyerId));

        Address address = addressMapper.toEntity(requestDTO, buyer);

        // First address a buyer ever saves is always the default, regardless of what was sent.
        boolean hasExistingAddresses = !addressRepository.findByBuyerId(buyerId).isEmpty();
        boolean shouldBeDefault = !hasExistingAddresses || requestDTO.isDefault();
        address.setDefault(shouldBeDefault);

        if (shouldBeDefault) {
            clearExistingDefault(buyerId);
        }

        Address saved = addressRepository.save(address);
        return addressMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponseDTO> getAddresses(Long buyerId) {
        return addressRepository.findByBuyerId(buyerId)
                .stream()
                .map(addressMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponseDTO getAddressById(Long buyerId, Long addressId) {
        Address address = addressRepository.findByIdAndBuyerId(addressId, buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        return addressMapper.toResponseDto(address);
    }

    @Override
    @Transactional
    public AddressResponseDTO updateAddress(Long buyerId, Long addressId, AddressRequestDTO requestDTO) {
        Address address = addressRepository.findByIdAndBuyerId(addressId, buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        addressMapper.updateEntityFromDto(requestDTO, address);

        if (requestDTO.isDefault() && !address.isDefault()) {
            clearExistingDefault(buyerId);
            address.setDefault(true);
        }

        Address updated = addressRepository.save(address);
        return addressMapper.toResponseDto(updated);
    }

    @Override
    @Transactional
    public void deleteAddress(Long buyerId, Long addressId) {
        Address address = addressRepository.findByIdAndBuyerId(addressId, buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        // Promote another address to default so the buyer always has one set (if any remain).
        if (wasDefault) {
            addressRepository.findByBuyerId(buyerId).stream()
                    .findFirst()
                    .ifPresent(next -> {
                        next.setDefault(true);
                        addressRepository.save(next);
                    });
        }
    }

    private void clearExistingDefault(Long buyerId) {
        addressRepository.findByBuyerIdAndIsDefaultTrue(buyerId)
                .ifPresent(current -> {
                    current.setDefault(false);
                    addressRepository.save(current);
                });
    }
}