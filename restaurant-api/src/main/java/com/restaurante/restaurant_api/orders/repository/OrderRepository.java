package com.restaurante.restaurant_api.orders.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.restaurante.restaurant_api.common.enums.OrderStatus;
import com.restaurante.restaurant_api.orders.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByTableIdOrderByCreatedAtDesc(Long tableId);

    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);

    // busca pedidos ativos (não entregues nem cancelados)
    @Query("SELECT o FROM Order o WHERE o.status NOT IN ('DELIVERED', 'CANCELLED') ORDER BY o.createdAt ASC")
    List<Order> findActiveOrders();
}