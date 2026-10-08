package com.agriconnect.backend.dto;

import com.agriconnect.backend.entity.OrderStatus;
import com.agriconnect.backend.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {

    private Long id;
    private String orderNumber;

    private Long buyerId;
    private String buyerName;

    private Long farmerId;
    private String farmerName;

    private List<OrderItemResponseDTO> items;
    private BigDecimal totalAmount;

    private AddressResponseDTO deliveryAddress;

    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private LocalDateTime orderedAt;
}