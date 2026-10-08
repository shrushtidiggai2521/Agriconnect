package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.OrderPlaceRequestDTO;
import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    /**
     * Places an order from the buyer's current cart. Splits into one {@code Order}
     * per distinct farmer represented in the cart.
     */
    List<OrderResponseDTO> placeOrder(Long buyerId, OrderPlaceRequestDTO requestDTO);

    Page<OrderResponseDTO> getMyOrders(Long buyerId, Pageable pageable);

    /**
     * @param requesterRole used to decide whether {@code requesterId} must match
     *                      the order's buyer or its farmer.
     */
    OrderResponseDTO getOrderById(Long orderId, Long requesterId, Role requesterRole);

    OrderResponseDTO cancelOrder(Long orderId, Long buyerId);

    Page<OrderResponseDTO> getFarmerOrders(Long farmerId, Pageable pageable);

    OrderResponseDTO acceptOrder(Long orderId, Long farmerId);

    OrderResponseDTO rejectOrder(Long orderId, Long farmerId);

    OrderResponseDTO shipOrder(Long orderId, Long farmerId);
}