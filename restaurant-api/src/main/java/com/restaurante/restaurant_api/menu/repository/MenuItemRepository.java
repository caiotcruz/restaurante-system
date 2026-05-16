package com.restaurante.restaurant_api.menu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.restaurante.restaurant_api.menu.entity.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);

    List<MenuItem> findAllByAvailableTrue();

    @Query("SELECT m FROM MenuItem m JOIN FETCH m.category WHERE m.available = true")
    List<MenuItem> findAllAvailableWithCategory();
}