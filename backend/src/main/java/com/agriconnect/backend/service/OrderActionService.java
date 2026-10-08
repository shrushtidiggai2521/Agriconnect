package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.OrderResponseDTO;

public interface OrderActionService {

    OrderResponseDTO getOrderByToken(String token);

    OrderResponseDTO acceptByToken(String token);

    OrderResponseDTO rejectByToken(String token);
}
