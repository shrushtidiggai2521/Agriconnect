package com.agriconnect.backend.repository;

import com.agriconnect.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByBuyerId(Long buyerId);

    /**
     * Scoped lookup - ensures a buyer can only fetch/modify their OWN address
     * by guessing an id (returns empty, mapped to 404, otherwise).
     */
    Optional<Address> findByIdAndBuyerId(Long id, Long buyerId);

    Optional<Address> findByBuyerIdAndIsDefaultTrue(Long buyerId);
}