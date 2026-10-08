package com.agriconnect.backend.controller;

import com.agriconnect.backend.dto.OrderResponseDTO;
import com.agriconnect.backend.service.OrderActionService;
import com.agriconnect.backend.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-actions")
@RequiredArgsConstructor
@Tag(
        name = "Order Quick Actions",
        description = "Accept or reject orders using secure farmer action links"
)
public class OrderActionController {

    private final OrderActionService orderActionService;

    @GetMapping("/{token}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderByToken(
            @PathVariable String token) {

        OrderResponseDTO order = orderActionService.getOrderByToken(token);

        return ResponseEntity.ok(
                ApiResponse.success("Order details fetched successfully", order)
        );
    }

    @Operation(summary = "Accept an order using a secure farmer token")
    @PostMapping("/{token}/accept")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> acceptOrder(
            @PathVariable String token) {

        OrderResponseDTO order =
                orderActionService.acceptByToken(token);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order accepted successfully",
                        order
                )
        );
    }

    @Operation(summary = "Reject an order using a secure farmer token")
    @PostMapping("/{token}/reject")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> rejectOrder(
            @PathVariable String token) {

        OrderResponseDTO order =
                orderActionService.rejectByToken(token);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Order rejected successfully",
                        order
                )
        );
    }
}