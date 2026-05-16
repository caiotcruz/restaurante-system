package com.restaurante.restaurant_api.orders.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.restaurante.restaurant_api.common.config.RabbitMQConfig;
import com.restaurante.restaurant_api.common.enums.OrderStatus;
import com.restaurante.restaurant_api.orders.dto.OrderDto;
import com.restaurante.restaurant_api.orders.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderConsumer {

    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = RabbitMQConfig.ORDERS_QUEUE)
    public void handleOrderCreated(OrderDto orderDto) {
        log.info("Pedido #{} recebido da fila — notificando cozinha", orderDto.id());

        // atualiza status para RECEIVED no banco
        orderRepository.findById(orderDto.id()).ifPresent(order -> {
            order.setStatus(OrderStatus.RECEIVED);
            orderRepository.save(order);
        });

        // notifica a cozinha via WebSocket
        messagingTemplate.convertAndSend("/topic/kitchen", orderDto);

        log.info("Cozinha notificada para o pedido #{}", orderDto.id());
    }
}