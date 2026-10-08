package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.AddressRequestDTO;
import com.agriconnect.backend.dto.AddressResponseDTO;

import java.util.List;

public interface AddressService {

    AddressResponseDTO createAddress(Long buyerId, AddressRequestDTO requestDTO);

    List<AddressResponseDTO> getAddresses(Long buyerId);

    AddressResponseDTO getAddressById(Long buyerId, Long addressId);

    AddressResponseDTO updateAddress(Long buyerId, Long addressId, AddressRequestDTO requestDTO);

    void deleteAddress(Long buyerId, Long addressId);
}