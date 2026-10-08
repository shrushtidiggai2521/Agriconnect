package com.agriconnect.backend.mapper;

import com.agriconnect.backend.entity.FarmerProfile;
import com.agriconnect.backend.dto.FarmerProfileDto;
import com.agriconnect.backend.dto.FarmerSummaryDto;
import com.agriconnect.backend.entity.User; // adjust to your actual User entity package
import org.springframework.stereotype.Component;

/**
 * Plain hand-written mapper (no MapStruct dependency assumed — if your
 * project already uses MapStruct elsewhere, swap this for an
 * @Mapper-annotated interface instead and delete the manual field
 * assignments below).
 *
 * Takes a User + an optional FarmerProfile (may be null — not every
 * farmer has filled one in yet) + counts computed by the service, and
 * produces the two response DTOs. Every profile-only field is passed
 * through as null when profile is null, which is intentional: the
 * frontend only renders a field when it's present.
 */
@Component
public class FarmerMapper {

    public FarmerSummaryDto toSummaryDto(User user, FarmerProfile profile, long productCount) {
        return new FarmerSummaryDto(
                user.getId(),
                user.getName(),
                profile != null ? profile.getLocation() : null,
                profile != null ? profile.getBio() : null,
                profile != null ? profile.getProfileImageUrl() : null,
                profile != null ? profile.getRatingAverage() : null,
                profile != null ? profile.getRatingCount() : null,
                productCount

        );
    }

    public FarmerProfileDto toProfileDto(User user, FarmerProfile profile, long productCount) {
        return new FarmerProfileDto(
                user.getId(),
                user.getName(),
                profile != null ? profile.getLocation() : null,
                profile != null ? profile.getBio() : null,
                profile != null ? profile.getProfileImageUrl() : null,
                profile != null ? profile.getRatingAverage() : null,
                profile != null ? profile.getRatingCount() : null,
                productCount,

                profile != null ? profile.getCreatedAt() : null
        );
    }
}
