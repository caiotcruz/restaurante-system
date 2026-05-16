package com.restaurante.restaurant_api.orders.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
    @NotNull Long tableId,
    @NotEmpty List<OrderItemRequest> items,
    String observations
) {}