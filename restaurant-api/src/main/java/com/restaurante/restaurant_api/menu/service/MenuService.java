package com.restaurante.restaurant_api.menu.service;

import java.util.List;
import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.restaurante.restaurant_api.common.exception.ResourceNotFoundException;
import com.restaurante.restaurant_api.menu.dto.MenuItemRequest;
import com.restaurante.restaurant_api.menu.entity.Category;
import com.restaurante.restaurant_api.menu.entity.MenuItem;
import com.restaurante.restaurant_api.menu.repository.CategoryRepository;
import com.restaurante.restaurant_api.menu.repository.MenuItemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String MENU_CACHE_KEY = "menu:all";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    public List<MenuItem> getFullMenu() {
        Object cached = redisTemplate.opsForValue().get(MENU_CACHE_KEY);
        if (cached != null) {
            return (List<MenuItem>) cached;
        }

        List<MenuItem> items = menuItemRepository.findAllAvailableWithCategory();
        redisTemplate.opsForValue().set(MENU_CACHE_KEY, items, CACHE_TTL);
        return items;
    }

    public MenuItem createItem(MenuItemRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        MenuItem item = MenuItem.builder()
            .name(request.name())
            .description(request.description())
            .price(request.price())
            .prepTimeMinutes(request.prepTimeMinutes())
            .category(category)
            .available(true)
            .build();

        MenuItem saved = menuItemRepository.save(item);
        redisTemplate.delete(MENU_CACHE_KEY);
        return saved;
    }

    public MenuItem toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));
        item.setAvailable(!item.getAvailable());
        MenuItem saved = menuItemRepository.save(item);
        redisTemplate.delete(MENU_CACHE_KEY);
        return saved;
    }
}