package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.ProductRequestDTO;
import com.agriconnect.backend.dto.ProductResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductResponseDTO createProduct(ProductRequestDTO requestDTO, Long farmerId);

    Page<ProductResponseDTO> getAllProducts(Pageable pageable);

    ProductResponseDTO getProductById(Long id);

    ProductResponseDTO updateProduct(Long id, ProductRequestDTO requestDTO, Long requesterId);

    void deleteProduct(Long id, Long requesterId);

    Page<ProductResponseDTO> searchProducts(String name, String category, String location, Pageable pageable);
}
