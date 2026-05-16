package com.restaurante.restaurant_api.tables.repository;

import com.restaurante.restaurant_api.tables.entity.RestaurantTable;
import com.restaurante.restaurant_api.common.enums.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByStatus(TableStatus status);
    List<RestaurantTable> findAllByOrderByNumberAsc();
}