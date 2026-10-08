package com.agriconnect.backend.mapper;

import com.agriconnect.backend.dto.PaymentResponseDTO;
import com.agriconnect.backend.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponseDTO toResponseDto(Payment payment) {
        if (payment == null) {
            return null;
        }
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .paymentId(payment.getPaymentId())
                .transactionId(payment.getTransactionId())
                .orderId(payment.getOrder().getId())
                .orderNumber(payment.getOrder().getOrderNumber())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paymentTime(payment.getPaymentTime())
                .build();
    }
}