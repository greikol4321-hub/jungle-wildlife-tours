-- Agregar columna tide_table para el tour en barco
alter table public.tours add column tide_table jsonb;

-- Nota: usa la categoría 'mangrove' existente (mismo ecosistema, distinto tour)
