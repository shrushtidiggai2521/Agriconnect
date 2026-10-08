package com.agriconnect.backend.mapper;

import com.agriconnect.backend.dto.AddressRequestDTO;
import com.agriconnect.backend.dto.AddressResponseDTO;
import com.agriconnect.backend.entity.Address;
import com.agriconnect.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(AddressRequestDTO dto, User buyer) {
        if (dto == null) {
            return null;
        }

        return Address.builder()
                .buyer(buyer)
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .isDefault(dto.isDefault())
                .build();
    }

    public void updateEntityFromDto(AddressRequestDTO dto, Address address) {
        address.setFullName(dto.getFullName());
        address.setPhone(dto.getPhone());
        address.setAddressLine(dto.getAddressLine());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());
    }

    public AddressResponseDTO toResponseDto(Address address) {
        if (address == null) {
            return null;
        }

        return AddressResponseDTO.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .addressLine(address.getAddressLine())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .isDefault(address.isDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }
}