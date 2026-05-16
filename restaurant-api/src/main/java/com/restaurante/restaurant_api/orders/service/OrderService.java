// orders/service/OrderService.java
package com.restaurante.restaurant_api.orders.service;

import com.restaurante.restaurant_api.common.enums.OrderStatus;
import com.restaurante.restaurant_api.common.exception.ResourceNotFoundException;
import com.restaurante.restaurant_api.menu.repository.MenuItemRepository;
import com.restaurante.restaurant_api.orders.dto.CreateOrderRequest;
import com.restaurante.restaurant_api.orders.entity.Order;
import com.restaurante.restaurant_api.orders.entity.OrderItem;
import com.restaurante.restaurant_api.orders.mapper.OrderMapper;
import com.restaurante.restaurant_api.orders.messaging.OrderProducer;
import com.restaurante.restaurant_api.orders.repository.OrderRepository;
import com.restaurante.restaurant_api.tables.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final OrderProducer orderProducer;
    private final SimpMessagingTemplate messagingTemplate;

    public Order createOrder(CreateOrderRequest request) {
        var table = tableRepository.findById(request.tableId())
            .orElseThrow(() -> new ResourceNotFoundException("Mesa não encontrada: " + request.tableId()));

        var order = Order.builder()
            .table(table)
            .observations(request.observations())
            .status(OrderStatus.PENDING)
            .build();

        var items = request.items().stream().map(itemReq -> {
            var menuItem = menuItemRepository.findById(itemReq.menuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado: " + itemReq.menuItemId()));

            return OrderItem.builder()
                .order(order)
                .menuItem(menuItem)
                .quantity(itemReq.quantity())
                .unitPrice(menuItem.getPrice())
                .observations(itemReq.observations())
                .build();
        }).toList();

        order.setItems(items);
        var saved = orderRepository.save(order);

        orderProducer.publishOrderCreated(saved);

        return saved;
    }

    public Order updateStatus(Long orderId, OrderStatus newStatus) {
        var order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + orderId));

        order.setStatus(newStatus);
        var saved = orderRepository.save(order);
        var dto = OrderMapper.toDto(saved);

        messagingTemplate.convertAndSend("/topic/orders/" + saved.getTable().getId(), dto);
        messagingTemplate.convertAndSend("/topic/kitchen", dto);
        messagingTemplate.convertAndSend("/topic/dashboard", dto);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Order> getActiveOrders() {
        return orderRepository.findActiveOrders();
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableIdOrderByCreatedAtDesc(tableId);
    }
}