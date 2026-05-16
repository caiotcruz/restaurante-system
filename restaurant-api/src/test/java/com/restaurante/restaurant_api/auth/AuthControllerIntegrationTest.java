package com.restaurante.restaurant_api.auth;

import com.restaurante.restaurant_api.BaseIntegrationTest;
import com.restaurante.restaurant_api.common.enums.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Auth — integração")
class AuthControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

    private record LoginReq(String username, String password) {}
    private record RegisterReq(String username, String password, UserRole role) {}

    @Test
    @DisplayName("Deve registrar e retornar JWT")
    void deveRegistrar() {
        var body = new RegisterReq("testuser_" + System.currentTimeMillis(), "senha123", UserRole.KITCHEN);
        var response = rest.postForEntity("/api/auth/register", body, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).containsKey("token");
    }

    @Test
    @DisplayName("Deve fazer login com credenciais válidas")
    void deveFazerLogin() {
        String user = "loginuser_" + System.currentTimeMillis();
        rest.postForEntity("/api/auth/register",
            new RegisterReq(user, "senha123", UserRole.MANAGER), Map.class);

        var response = rest.postForEntity("/api/auth/login",
            new LoginReq(user, "senha123"), Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsKey("token");
    }

    @Test
    @DisplayName("Deve rejeitar credenciais inválidas")
    void deveRejeitarLoginInvalido() {
        var response = rest.postForEntity("/api/auth/login",
            new LoginReq("naoexiste", "errado"), Map.class);

        assertThat(response.getStatusCode().value()).isGreaterThanOrEqualTo(400);
    }
}