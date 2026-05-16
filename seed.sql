INSERT INTO restaurant_tables (number, capacity, status) VALUES
  (1, 4, 'FREE'), (2, 2, 'FREE'), (3, 6, 'FREE'),
  (4, 4, 'FREE'), (5, 8, 'FREE');

INSERT INTO categories (name, display_order) VALUES
  ('Entradas', 1), ('Pratos Principais', 2), ('Bebidas', 3), ('Sobremesas', 4);

INSERT INTO menu_items (name, description, price, prep_time_minutes, available, category_id) VALUES
  ('Bruschetta Italiana', 'Pão tostado com tomate fresco e manjericão', 28.90, 10, true, 1),
  ('Carpaccio de Filé', 'Fatias finas com alcaparras e rúcula', 45.00, 15, true, 1),
  ('Risoto de Funghi', 'Arroz arbóreo com cogumelos e parmesão', 68.00, 25, true, 2),
  ('Filé ao Molho Madeira', 'Filé mignon grelhado com batatas rústicas', 89.90, 30, true, 2),
  ('Água Mineral', '500ml', 8.00, 2, true, 3),
  ('Suco de Maracujá', 'Natural, 400ml', 14.00, 5, true, 3),
  ('Petit Gateau', 'Bolo quente com sorvete de creme', 32.00, 20, true, 4);

