// orders/mapper/OrderMapper.java
package com.restaurante.restaurant_api.orders.mapper;

import com.restaurante.restaurant_api.orders.dto.OrderDto;
import com.restaurante.restaurant_api.orders.dto.OrderItemDto;
import com.restaurante.restaurant_api.orders.entity.Order;
import com.restaurante.restaurant_api.orders.entity.OrderItem;

import java.util.List;

public final class OrderMapper {

    private OrderMapper() {}  // classe utilitária — não instanciar

    public static OrderDto toDto(Order order) {
        return new OrderDto(
            order.getId(),
            order.getTable().getId(),
            order.getTable().getNumber(),
            order.getStatus(),
            toItemDtoList(order.getItems()),
            order.getTotal(),
            order.getObservations(),
            order.getCreatedAt()
        );
    }

    public static List<OrderDto> toDtoList(List<Order> orders) {
        return orders.stream()
            .map(OrderMapper::toDto)
            .toList();
    }

    private static List<OrderItemDto> toItemDtoList(List<OrderItem> items) {
        return items.stream()
            .map(OrderMapper::toItemDto)
            .toList();
    }

    private static OrderItemDto toItemDto(OrderItem item) {
        return new OrderItemDto(
            item.getId(),
            item.getMenuItem().getName(),
            item.getQuantity(),
            item.getUnitPrice(),
            item.getSubtotal(),
            item.getObservations()
        );
    }
}