package com.restaurante.restaurant_api.menu;

import com.restaurante.restaurant_api.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Menu — integração")
class MenuControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

    @Test
    @DisplayName("GET /api/menu deve responder 200 sem autenticação")
    void deveRetornarCardapio() {
        ResponseEntity<List> response = rest.getForEntity("/api/menu", List.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotEmpty();
    }
}