package com.agriconnect.backend.service;

import com.agriconnect.backend.dto.PaymentCreateRequestDTO;
import com.agriconnect.backend.dto.PaymentResponseDTO;
import com.agriconnect.backend.dto.PaymentStatusUpdateRequestDTO;
import com.agriconnect.backend.entity.Role;

public interface PaymentService {

    /**
     * Creates a payment attempt and synchronously charges it through the
     * configured {@link PaymentGateway}. Throws {@code PaymentFailedException}
     * if the gateway declines the charge (the failed attempt is still persisted).
     */
    PaymentResponseDTO createPayment(Long buyerId, PaymentCreateRequestDTO requestDTO);

    /** Manually marks a payment attempt as successful (simulated gateway callback). */
    PaymentResponseDTO markPaymentSuccess(Long requesterId, PaymentStatusUpdateRequestDTO requestDTO);

    /** Manually marks a payment attempt as failed (simulated gateway callback). */
    PaymentResponseDTO markPaymentFailure(Long requesterId, PaymentStatusUpdateRequestDTO requestDTO);

    PaymentResponseDTO getPaymentForOrder(Long orderId, Long requesterId, Role requesterRole);
}