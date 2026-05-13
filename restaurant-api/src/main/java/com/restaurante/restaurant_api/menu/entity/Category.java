package com.restaurante.restaurant_api.menu.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; 

    @Column
    private Integer displayOrder;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<MenuItem> items = new ArrayList<>();
}