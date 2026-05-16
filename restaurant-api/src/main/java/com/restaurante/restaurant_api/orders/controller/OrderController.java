// orders/controller/OrderController.java
package com.restaurante.restaurant_api.orders.controller;

import com.restaurante.restaurant_api.orders.dto.CreateOrderRequest;
import com.restaurante.restaurant_api.orders.dto.OrderDto;
import com.restaurante.restaurant_api.orders.dto.UpdateOrderStatusRequest;
import com.restaurante.restaurant_api.orders.mapper.OrderMapper;
import com.restaurante.restaurant_api.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(OrderMapper.toDto(orderService.createOrder(request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('KITCHEN', 'MANAGER', 'WAITER')")
    public ResponseEntity<OrderDto> updateStatus(
        @PathVariable Long id,
        @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(OrderMapper.toDto(orderService.updateStatus(id, request.status())));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('KITCHEN', 'MANAGER')")
    public ResponseEntity<List<OrderDto>> getActiveOrders() {
        return ResponseEntity.ok(OrderMapper.toDtoList(orderService.getActiveOrders()));
    }

    @GetMapping("/table/{tableId}")
    public ResponseEntity<List<OrderDto>> getByTable(@PathVariable Long tableId) {
        return ResponseEntity.ok(OrderMapper.toDtoList(orderService.getOrdersByTable(tableId)));
    }
}