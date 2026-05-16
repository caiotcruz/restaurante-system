package com.restaurante.restaurant_api.menu.dto;

import java.math.BigDecimal;

public record MenuItemDto(
    Long id,
    String name,
    String description,
    BigDecimal price,
    String imageUrl,
    Integer prepTimeMinutes,
    Boolean available,
    Long categoryId,
    String categoryName
) {}