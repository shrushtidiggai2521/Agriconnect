package com.agriconnect.backend.serviceImpl;

import com.agriconnect.backend.dto.*;
import com.agriconnect.backend.entity.*;
import com.agriconnect.backend.mapper.PaymentMapper;
import com.agriconnect.backend.repository.OrderRepository;
import com.agriconnect.backend.repository.PaymentRepository;
import com.agriconnect.backend.service.PaymentGateway;
import com.agriconnect.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentGateway paymentGateway;

    @Override
    public PaymentResponseDTO createPayment(Long buyerId, PaymentCreateRequestDTO requestDTO) {

        Order order = orderRepository.findById(requestDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyer().getId().equals(buyerId)) {
            throw new RuntimeException("You are not allowed to pay for this order.");
        }

        Payment payment = Payment.builder()
                .order(order)
                .paymentId("PAY-" + UUID.randomUUID())
                .amount(order.getTotalAmount())
                .paymentMethod(requestDTO.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .paymentTime(LocalDateTime.now())
                .build();

        payment = paymentRepository.save(payment);

        PaymentGatewayResponse response = paymentGateway.charge(
                PaymentGatewayRequest.builder()
                        .paymentId(payment.getPaymentId())
                        .amount(payment.getAmount())
                        .paymentMethod(payment.getPaymentMethod())
                        .build()
        );

        if (response.isSuccess()) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setTransactionId(response.getTransactionId());
            order.setPaymentStatus(PaymentStatus.PAID);
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            order.setPaymentStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);

        return paymentMapper.toResponseDto(payment);
    }

    @Override
    public PaymentResponseDTO markPaymentSuccess(Long requesterId,
                                                 PaymentStatusUpdateRequestDTO requestDTO) {

        Payment payment = paymentRepository.findByPaymentId(requestDTO.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.getOrder().setPaymentStatus(PaymentStatus.PAID);

        paymentRepository.save(payment);
        orderRepository.save(payment.getOrder());

        return paymentMapper.toResponseDto(payment);
    }

    @Override
    public PaymentResponseDTO markPaymentFailure(Long requesterId,
                                                 PaymentStatusUpdateRequestDTO requestDTO) {

        Payment payment = paymentRepository.findByPaymentId(requestDTO.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentStatus(PaymentStatus.FAILED);

        paymentRepository.save(payment);

        return paymentMapper.toResponseDto(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentForOrder(Long orderId,
                                                 Long requesterId,
                                                 Role requesterRole) {

        Payment payment = paymentRepository
                .findFirstByOrderIdOrderByPaymentTimeDesc(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "No payment found for order " + orderId
                ));

        Order order = payment.getOrder();

        boolean isBuyer =
                requesterRole == Role.BUYER &&
                        order.getBuyer().getId().equals(requesterId);

        boolean isFarmer =
                requesterRole == Role.FARMER &&
                        order.getFarmer().getId().equals(requesterId);

        if (!isBuyer && !isFarmer) {
            throw new AccessDeniedException(
                    "You do not have permission to view this payment"
            );
        }

        return paymentMapper.toResponseDto(payment);
    }
}