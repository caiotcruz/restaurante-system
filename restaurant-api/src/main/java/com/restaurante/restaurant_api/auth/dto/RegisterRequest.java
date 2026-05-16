package com.restaurante.restaurant_api.auth.dto;

import com.restaurante.restaurant_api.common.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(
    @NotBlank String username,
    @NotBlank String password,
    @NotNull  UserRole role
) {}