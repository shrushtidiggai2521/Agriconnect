package com.agriconnect.backend.repository;

import com.agriconnect.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * {@link JpaSpecificationExecutor} enables dynamic, composable search
 * (name / category / location, any subset) used by GET /api/products/search.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {



    long countByFarmerId(Long farmerId);
}
