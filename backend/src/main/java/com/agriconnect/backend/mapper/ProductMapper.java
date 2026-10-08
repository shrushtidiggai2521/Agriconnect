package com.agriconnect.backend.mapper;

import com.agriconnect.backend.dto.ProductRequestDTO;
import com.agriconnect.backend.dto.ProductResponseDTO;
import com.agriconnect.backend.entity.Product;
import com.agriconnect.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequestDTO dto, User farmer) {
        if (dto == null) {
            return null;
        }
        return Product.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .unit(dto.getUnit())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .location(dto.getLocation())
                .farmer(farmer)
                .build();
    }

    public void updateEntityFromDto(ProductRequestDTO dto, Product product) {
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setUnit(dto.getUnit());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setLocation(dto.getLocation());
    }

    public ProductResponseDTO toResponseDto(Product product) {
        if (product == null) {
            return null;
        }
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .unit(product.getUnit())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .location(product.getLocation())
                .createdAt(product.getCreatedAt())
                .farmerId(product.getFarmer().getId())
                .farmerName(product.getFarmer().getName())
                .build();
    }
}
