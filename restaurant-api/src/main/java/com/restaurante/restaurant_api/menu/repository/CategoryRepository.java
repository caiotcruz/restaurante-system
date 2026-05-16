package com.restaurante.restaurant_api.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurante.restaurant_api.menu.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}