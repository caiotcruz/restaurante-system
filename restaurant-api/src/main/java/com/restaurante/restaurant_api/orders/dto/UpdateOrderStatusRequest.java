package com.restaurante.restaurant_api.orders.dto;

import com.restaurante.restaurant_api.common.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull OrderStatus status
) {}