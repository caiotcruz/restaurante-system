package com.restaurante.restaurant_api.tables.controller;

import com.restaurante.restaurant_api.common.enums.TableStatus;
import com.restaurante.restaurant_api.tables.entity.RestaurantTable;
import com.restaurante.restaurant_api.tables.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> findAll() {
        return ResponseEntity.ok(tableService.findAll());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'WAITER')")
    public ResponseEntity<RestaurantTable> updateStatus(
        @PathVariable Long id,
        @RequestParam TableStatus status
    ) {
        return ResponseEntity.ok(tableService.updateStatus(id, status));
    }
}