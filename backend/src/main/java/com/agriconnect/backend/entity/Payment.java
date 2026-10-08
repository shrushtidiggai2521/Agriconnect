package com.agriconnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A single payment attempt against an {@link Order}. Modeled as many-to-one
 * (not one-to-one) because a failed attempt shouldn't block retrying -
 * an order can accumulate several {@link Payment} rows before one succeeds.
 */
@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /** Our own internally generated reference for this payment attempt. */
    @Column(name = "payment_id", nullable = false, unique = true, length = 40)
    private String paymentId;

    /** Reference returned by the payment gateway (null until the gateway responds). */
    @Column(name = "transaction_id", length = 60)
    private String transactionId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_time", nullable = false)
    private LocalDateTime paymentTime;

    @PrePersist
    protected void onCreate() {
        if (this.paymentTime == null) {
            this.paymentTime = LocalDateTime.now();
        }
    }
}