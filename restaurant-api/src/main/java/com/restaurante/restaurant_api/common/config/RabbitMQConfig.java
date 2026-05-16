package com.restaurante.restaurant_api.common.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String ORDERS_QUEUE       = "orders.queue";
    public static final String ORDERS_EXCHANGE     = "orders.exchange";
    public static final String ORDERS_ROUTING_KEY  = "orders.created";

    public static final String DLQ_QUEUE          = "orders.dlq";      
    public static final String DLQ_EXCHANGE        = "orders.dlx";

    @Bean
    public Queue ordersQueue() {
        return QueueBuilder.durable(ORDERS_QUEUE)
            .withArgument("x-dead-letter-exchange", DLQ_EXCHANGE)  
            .withArgument("x-dead-letter-routing-key", "orders.failed")
            .build();
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DLQ_QUEUE).build();
    }

    @Bean
    public TopicExchange ordersExchange() {
        return new TopicExchange(ORDERS_EXCHANGE);
    }

    @Bean
    public TopicExchange deadLetterExchange() {
        return new TopicExchange(DLQ_EXCHANGE);
    }

    @Bean
    public Binding ordersBinding() {
        return BindingBuilder.bind(ordersQueue()).to(ordersExchange()).with(ORDERS_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter(); 
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory factory) {
        RabbitTemplate template = new RabbitTemplate(factory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}