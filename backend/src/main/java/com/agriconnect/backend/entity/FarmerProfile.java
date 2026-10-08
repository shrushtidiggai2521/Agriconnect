package com.agriconnect.backend.entity;

import com.agriconnect.backend.entity.User; // adjust to your actual User entity package
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Extended public-profile data for a User whose role is FARMER.
 * Kept as a separate table (one-to-one with User) rather than adding
 * columns to the existing User entity, so registration/auth is untouched.
 * A farmer may not have a row here yet (profile is optional/opt-in) —
 * the service layer falls back to defaults when this is null.
 */
@Entity
@Table(name = "farmer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One row per farmer. unique = true enforces the 1:1 relationship.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 1000)
    private String bio;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    // Denormalized copy of the farmer's primary location, editable
    // independently of any single product's location.
    private String location;

    // Simple running average; recalculate in the service layer whenever
    // a new rating is submitted (e.g. via a future reviews feature).
    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "rating_count")
    @Builder.Default
    private Integer ratingCount = 0;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
        if (this.ratingCount == null) this.ratingCount = 0;
    }
}
