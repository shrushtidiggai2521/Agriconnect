package com.agriconnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response payload for Product endpoints. Includes a flattened farmerId/farmerName
 * instead of nesting the full UserResponseDTO, keeping the payload light for list views.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private String unit;
    private String description;
    private String imageUrl;
    private String location;
    private LocalDateTime createdAt;

    private Long farmerId;
    private String farmerName;
}
