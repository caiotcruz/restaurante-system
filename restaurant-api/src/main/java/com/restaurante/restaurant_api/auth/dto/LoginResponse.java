package com.restaurante.restaurant_api.auth.dto;

public record LoginResponse(
    String token,
    String role,
    String username
) {}