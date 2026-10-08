package com.agriconnect.backend.repository;

import com.agriconnect.backend.entity.OrderActionToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderActionTokenRepository
        extends JpaRepository<OrderActionToken, Long> {

    Optional<OrderActionToken> findByToken(String token);
}
