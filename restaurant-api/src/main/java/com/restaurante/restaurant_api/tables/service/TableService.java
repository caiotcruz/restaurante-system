package com.restaurante.restaurant_api.tables.service;

import com.restaurante.restaurant_api.common.enums.TableStatus;
import com.restaurante.restaurant_api.tables.entity.RestaurantTable;
import com.restaurante.restaurant_api.tables.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final RestaurantTableRepository tableRepository;

    public List<RestaurantTable> findAll() {
        return tableRepository.findAllByOrderByNumberAsc();
    }

    public RestaurantTable updateStatus(Long id, TableStatus newStatus) {
        RestaurantTable table = tableRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));
        table.setStatus(newStatus);
        return tableRepository.save(table);
    }
}