// orders/dto/OrderDto.java
package com.restaurante.restaurant_api.orders.dto;

import com.restaurante.restaurant_api.common.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
    Long id,
    Long tableId,
    Integer tableNumber,
    OrderStatus status,
    List<OrderItemDto> items,
    BigDecimal total,
    String observations,
    LocalDateTime createdAt
) {}