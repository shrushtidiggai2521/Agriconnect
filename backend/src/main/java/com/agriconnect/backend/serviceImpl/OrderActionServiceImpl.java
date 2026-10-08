package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.entity.Order;
import com.agriconnect.backend.entity.OrderActionToken;
import com.agriconnect.backend.entity.TokenAction;
import com.agriconnect.backend.exception.ResourceNotFoundException;
import com.agriconnect.backend.repository.OrderActionTokenRepository;
import com.agriconnect.backend.service.OrderActionService;
import com.agriconnect.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.agriconnect.backend.mapper.OrderMapper;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderActionServiceImpl implements OrderActionService {

    private final OrderActionTokenRepository tokenRepository;
    private final OrderService orderService;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponseDTO acceptByToken(String token) {

        OrderActionToken actionToken = validateToken(token, TokenAction.ACCEPT);

        Long orderId = actionToken.getOrder().getId();
        Long farmerId = actionToken.getFarmer().getId();

        OrderResponseDTO response =
                orderService.acceptOrder(orderId, farmerId);

        actionToken.setUsed(true);
        tokenRepository.save(actionToken);

        return response;
    }

    @Override
    @Transactional
    public OrderResponseDTO rejectByToken(String token) {

        OrderActionToken actionToken = validateToken(token, TokenAction.REJECT);

        Long orderId = actionToken.getOrder().getId();
        Long farmerId = actionToken.getFarmer().getId();

        OrderResponseDTO response =
                orderService.rejectOrder(orderId, farmerId);

        actionToken.setUsed(true);
        tokenRepository.save(actionToken);

        return response;
    }

    private OrderActionToken validateToken(
            String token,
            TokenAction expectedAction) {

        OrderActionToken actionToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid order action link"));

        if (actionToken.isUsed()) {
            throw new IllegalStateException(
                    "This order action link has already been used");
        }

        if (actionToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalStateException(
                    "This order action link has expired");
        }

        if (actionToken.getAction() != expectedAction) {
            throw new IllegalArgumentException(
                    "Invalid action for this link");
        }

        return actionToken;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderByToken(String token) {

        OrderActionToken actionToken = tokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order action token",
                                "token",
                                token
                        ));

        //if (actionToken.isExpired()) {
        //  throw new IllegalStateException("This order link has expired");
        //}

        Order order = actionToken.getOrder();

        return orderMapper.toResponseDto(order);
    }
}
