package com.restaurante.restaurant_api.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.restaurante.restaurant_api.auth.dto.LoginRequest;
import com.restaurante.restaurant_api.auth.dto.LoginResponse;
import com.restaurante.restaurant_api.auth.dto.RegisterRequest;
import com.restaurante.restaurant_api.auth.entity.User;
import com.restaurante.restaurant_api.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        User user = userRepository.findByUsername(request.username())
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        String token = jwtService.generateToken(user);
        return new LoginResponse(token, user.getRole().name(), user.getUsername());
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username já em uso");
        }
        User user = User.builder()
            .username(request.username())
            .password(passwordEncoder.encode(request.password()))
            .role(request.role())
            .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new LoginResponse(token, user.getRole().name(), user.getUsername());
    }
}