package com.restaurante.restaurant_api.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Sistema de Restaurante — API")
                .description("""
                    API REST para o sistema distribuído de gestão de restaurante.
                    
                    **Módulos:** Mesa (tablet do cliente) · Cozinha · Gerência
                    
                    **Autenticação:** JWT Bearer — faça login em `/api/auth/login`
                    e cole o token no botão Authorize.
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("Caio Teixeira")
                    .url("https://github.com/caiotcruz")
                    .email("caiotcruz@gmail.com")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Token"))
            .components(new Components()
                .addSecuritySchemes("Bearer Token",
                    new SecurityScheme()
                        .name("Bearer Token")
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Cole o token JWT retornado pelo endpoint /api/auth/login")));
    }
}