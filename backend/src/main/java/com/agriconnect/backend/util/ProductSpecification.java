package com.agriconnect.backend.util;

import com.agriconnect.backend.entity.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Composable {@link Specification} filters for GET /api/products/search.
 * Any parameter left blank/null is simply skipped (returns a null predicate,
 * which Spring Data's {@code Specification.and(...)} ignores).
 */
public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> hasNameLike(String name) {
        return (root, query, cb) -> StringUtils.hasText(name)
                ? cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%")
                : null;
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) -> StringUtils.hasText(category)
                ? cb.equal(cb.lower(root.get("category")), category.toLowerCase())
                : null;
    }

    public static Specification<Product> hasLocationLike(String location) {
        return (root, query, cb) -> StringUtils.hasText(location)
                ? cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%")
                : null;
    }
}
