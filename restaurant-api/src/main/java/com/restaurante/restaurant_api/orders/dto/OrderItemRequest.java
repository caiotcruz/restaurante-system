package com.restaurante.restaurant_api.orders.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
    @NotNull Long menuItemId,
    @Min(1) Integer quantity,
    String observations
) {}