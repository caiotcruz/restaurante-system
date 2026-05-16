package com.restaurante.restaurant_api.orders.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurante.restaurant_api.orders.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}