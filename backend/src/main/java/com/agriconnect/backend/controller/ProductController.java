package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.ProductRequestDTO;
import com.agriconnect.backend.dto.ProductResponseDTO;
import com.agriconnect.backend.security.UserPrincipal;
import com.agriconnect.backend.service.ProductService;
import com.agriconnect.backend.util.ApiResponse;
import com.agriconnect.backend.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for Farmer-listed products.
 * <p>
 * Create/update/delete are restricted to authenticated users with role FARMER
 * (see {@code @PreAuthorize}), and the service layer additionally verifies
 * that a farmer can only modify their OWN products. Read endpoints are open
 * to any authenticated user (Farmers, Buyers, Suppliers all need to browse
 * the marketplace).
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs for farmers to list and manage marketplace products")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Create a new product (FARMER only)")
    @PreAuthorize("hasRole('FARMER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @Valid @RequestBody ProductRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        ProductResponseDTO created = productService.createProduct(requestDTO, principal.getId());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", created));
    }

    @Operation(summary = "Get all products (paginated, sortable)")
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponseDTO>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<ProductResponseDTO> products = productService.getAllProducts(buildPageable(page, size, sortBy, direction));
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", PagedResponse.from(products)));
    }

    @Operation(summary = "Get a product by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", product));
    }

    @Operation(summary = "Update a product (FARMER only, must be the product owner)")
    @PreAuthorize("hasRole('FARMER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO requestDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        ProductResponseDTO updated = productService.updateProduct(id, requestDTO, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @Operation(summary = "Delete a product (FARMER only, must be the product owner)")
    @PreAuthorize("hasRole('FARMER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        productService.deleteProduct(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }

    @Operation(summary = "Search products by name, category and/or location (paginated, sortable)")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponseDTO>>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<ProductResponseDTO> results = productService.searchProducts(
                name, category, location, buildPageable(page, size, sortBy, direction));
        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", PagedResponse.from(results)));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String direction) {
        Sort sort = "asc".equalsIgnoreCase(direction) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }
}
