package com.restaurante.restaurant_api;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("restaurante_test")
            .withUsername("test")
            .withPassword("test");

    @Container
    static RabbitMQContainer rabbitMQ =
        new RabbitMQContainer("rabbitmq:3.13-alpine");

    @Container
    @SuppressWarnings("resource")
    static GenericContainer<?> redis =
        new GenericContainer<>(DockerImageName.parse("redis:7-alpine"))
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url",      postgres::getJdbcUrl);
        registry.add("spring.datasource.username",  postgres::getUsername);
        registry.add("spring.datasource.password",  postgres::getPassword);
        registry.add("spring.rabbitmq.host",        rabbitMQ::getHost);
        registry.add("spring.rabbitmq.port",        rabbitMQ::getAmqpPort);
        registry.add("spring.rabbitmq.username",    () -> "guest");
        registry.add("spring.rabbitmq.password",    () -> "guest");
        registry.add("spring.data.redis.host",      redis::getHost);
        registry.add("spring.data.redis.port",      () -> redis.getMappedPort(6379).toString());
        registry.add("spring.data.redis.password",  () -> "");  
    }
}