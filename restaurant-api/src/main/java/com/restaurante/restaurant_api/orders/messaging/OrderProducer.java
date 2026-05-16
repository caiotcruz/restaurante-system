package com.restaurante.restaurant_api.orders.messaging;

import com.restaurante.restaurant_api.common.config.RabbitMQConfig;
import com.restaurante.restaurant_api.orders.dto.OrderDto;
import com.restaurante.restaurant_api.orders.entity.Order;
import com.restaurante.restaurant_api.orders.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderProducer {

    private final RabbitTemplate rabbitTemplate;

    public void publishOrderCreated(Order order) {
        OrderDto dto = OrderMapper.toDto(order);

        log.info("Publicando pedido #{} na fila", order.getId());

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.ORDERS_EXCHANGE,
            RabbitMQConfig.ORDERS_ROUTING_KEY,
            dto
        );
    }
}