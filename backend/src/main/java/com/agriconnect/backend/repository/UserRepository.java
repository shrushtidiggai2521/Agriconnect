package com.agriconnect.backend.repository;

import com.agriconnect.backend.entity.Role;
import com.agriconnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    List<User> findByRole(Role role);

    /**
     * Used when updating a user - checks whether the email is taken by a
     * DIFFERENT user (excludes the user currently being updated).
     */
    boolean existsByEmailAndIdNot(String email, Long id);
}
