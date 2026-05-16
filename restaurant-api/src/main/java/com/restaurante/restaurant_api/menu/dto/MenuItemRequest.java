package com.restaurante.restaurant_api.menu.dto;

import java.math.BigDecimal;

public record MenuItemRequest(
    Long categoryId,
    String name,
    String description,
    BigDecimal price,
    Integer prepTimeMinutes
) {}
