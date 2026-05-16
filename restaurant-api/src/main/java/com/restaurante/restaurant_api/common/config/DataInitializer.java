// common/config/DataInitializer.java
package com.restaurante.restaurant_api.common.config;

import com.restaurante.restaurant_api.auth.entity.User;
import com.restaurante.restaurant_api.auth.repository.UserRepository;
import com.restaurante.restaurant_api.common.enums.TableStatus;
import com.restaurante.restaurant_api.common.enums.UserRole;
import com.restaurante.restaurant_api.menu.entity.Category;
import com.restaurante.restaurant_api.menu.entity.MenuItem;
import com.restaurante.restaurant_api.menu.repository.CategoryRepository;
import com.restaurante.restaurant_api.menu.repository.MenuItemRepository;
import com.restaurante.restaurant_api.tables.entity.RestaurantTable;
import com.restaurante.restaurant_api.tables.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;

    @Override
    public void run(String... args) {
        seedUsers();
        seedTables();
        seedMenu();
    }

    // ── Usuários ────────────────────────────────────────────────────────────
    private void seedUsers() {
        createIfAbsent("cozinha1",  "cozinha123",  UserRole.KITCHEN);
        createIfAbsent("gerente1",  "gerente123",  UserRole.MANAGER);
        createIfAbsent("garcom1",   "garcom123",   UserRole.WAITER);
    }

    private void createIfAbsent(String username, String password, UserRole role) {
        if (userRepository.existsByUsername(username)) return;
        userRepository.save(User.builder()
            .username(username)
            .password(passwordEncoder.encode(password))
            .role(role)
            .build());
        log.info("✔ Usuário criado: {} [{}]", username, role);
    }

    // ── Mesas ────────────────────────────────────────────────────────────────
    private void seedTables() {
        if (tableRepository.count() > 0) return;
        tableRepository.saveAll(List.of(
            table(1, 2), table(2, 4), table(3, 4),
            table(4, 6), table(5, 8), table(6, 2),
            table(7, 4), table(8, 4)
        ));
        log.info("✔ 8 mesas criadas");
    }

    private RestaurantTable table(int number, int capacity) {
        return RestaurantTable.builder()
            .number(number).capacity(capacity).status(TableStatus.FREE).build();
    }

    // ── Cardápio ─────────────────────────────────────────────────────────────
    private void seedMenu() {
        if (menuItemRepository.count() > 0) return;

        Category entradas    = cat("Entradas",          1);
        Category pratos      = cat("Pratos Principais", 2);
        Category bebidas     = cat("Bebidas",           3);
        Category sobremesas  = cat("Sobremesas",        4);

        menuItemRepository.saveAll(List.of(
            // Entradas
            item("Bruschetta Italiana",
                 "Pão tostado com tomate fresco, alho e manjericão",
                 "28.90", 10, entradas),
            item("Carpaccio de Filé",
                 "Fatias finas de filé com alcaparras, rúcula e parmesão",
                 "45.00", 15, entradas),
            item("Creme de Abóbora",
                 "Creme aveludado com sementes tostadas e azeite trufado",
                 "32.00", 20, entradas),

            // Pratos
            item("Risoto de Funghi",
                 "Arroz arbóreo com mix de cogumelos e parmesão envelhecido",
                 "68.00", 25, pratos),
            item("Filé ao Molho Madeira",
                 "Filé mignon grelhado com molho madeira e batatas rústicas",
                 "89.90", 30, pratos),
            item("Salmão Grelhado",
                 "Salmão ao limão siciliano com legumes da estação",
                 "79.90", 25, pratos),
            item("Frango à Parmegiana",
                 "Frango empanado com molho de tomate e mozzarella gratinada",
                 "62.00", 25, pratos),

            // Bebidas
            item("Água Mineral",    "500ml, com ou sem gás",                        "8.00",  2, bebidas),
            item("Suco Natural",    "Laranja, maracujá ou limão — 400ml",           "14.00", 5, bebidas),
            item("Refrigerante",    "Lata 350ml — Coca-Cola, Guaraná ou Sprite",    "9.00",  2, bebidas),
            item("Cerveja Artesanal","Long neck 355ml — IPA, Weiss ou Pilsen",      "18.00", 3, bebidas),

            // Sobremesas
            item("Petit Gateau",
                 "Bolinho quente de chocolate com sorvete de creme",
                 "32.00", 20, sobremesas),
            item("Tiramisù",
                 "Clássico italiano com mascarpone, café e cacau",
                 "28.00", 10, sobremesas)
        ));
        log.info("✔ Cardápio criado com {} itens", menuItemRepository.count());
    }

    private Category cat(String name, int order) {
        return categoryRepository.save(
            Category.builder().name(name).displayOrder(order).build()
        );
    }

    private MenuItem item(String name, String desc, String price, int prep, Category cat) {
        return MenuItem.builder()
            .name(name).description(desc)
            .price(new BigDecimal(price))
            .prepTimeMinutes(prep)
            .available(true)
            .category(cat)
            .build();
    }
}