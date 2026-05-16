package com.restaurante.restaurant_api.orders.dto;

import java.math.BigDecimal;

public record OrderItemDto(
    Long id,
    String menuItemName,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal subtotal,
    String observations
) {}