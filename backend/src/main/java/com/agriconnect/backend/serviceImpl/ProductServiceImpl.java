package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.ProductRequestDTO;
import com.agriconnect.backend.dto.ProductResponseDTO;
import com.agriconnect.backend.entity.Product;
import com.agriconnect.backend.entity.User;
import com.agriconnect.backend.exception.ResourceNotFoundException;
import com.agriconnect.backend.mapper.ProductMapper;
import com.agriconnect.backend.repository.ProductRepository;
import com.agriconnect.backend.repository.UserRepository;
import com.agriconnect.backend.service.ProductService;
import com.agriconnect.backend.util.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO, Long farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", farmerId));

        Product product = productMapper.toEntity(requestDTO, farmer);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDto(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(productMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return productMapper.toResponseDto(product);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO requestDTO, Long requesterId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        assertOwnedByRequester(product, requesterId);

        productMapper.updateEntityFromDto(requestDTO, product);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponseDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id, Long requesterId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        assertOwnedByRequester(product, requesterId);

        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> searchProducts(String name, String category, String location, Pageable pageable) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasNameLike(name))
                .and(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.hasLocationLike(location));

        return productRepository.findAll(spec, pageable)
                .map(productMapper::toResponseDto);
    }

    /**
     * Only the farmer who posted a product may update/delete it.
     */
    private void assertOwnedByRequester(Product product, Long requesterId) {
        if (!product.getFarmer().getId().equals(requesterId)) {
            throw new AccessDeniedException("You can only modify products you posted yourself");
        }
    }
}
