package com.restaurante.restaurant_api.tables.dto;

import com.restaurante.restaurant_api.common.enums.TableStatus;

public record TableDto(
    Long id,
    Integer number,
    Integer capacity,
    TableStatus status
) {}