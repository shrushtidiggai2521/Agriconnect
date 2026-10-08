package com.agriconnect.backend.repository;

import com.agriconnect.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    /**
     * Used to verify a cart item actually belongs to the requesting buyer's cart
     * before allowing an update/removal - prevents one buyer from mutating
     * another buyer's cart item by guessing its id.
     */
    Optional<CartItem> findByIdAndCartId(Long id, Long cartId);
}
