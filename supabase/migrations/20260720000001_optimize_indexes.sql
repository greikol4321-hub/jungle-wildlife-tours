-- ============================================================
-- MÓDULO 01 — Indexing (batch 2): eliminar full scans restantes
-- ============================================================
-- Análisis de consultas del código:
--   homepage, tours listing:  WHERE is_active ORDER BY views DESC, display_order LIMIT 3
--   gallery:                  ORDER BY display_order LIMIT 100 (sin filtro tour_id)
--   admin reviews list:       ORDER BY created_at DESC (sin filtro)
--   reviews section:          WHERE tour_id + is_approved ORDER BY created_at DESC
--   admin dashboard:          COUNT(*) de reviews WHERE is_approved = false
-- ============================================================

-- 1. tours: ORDER BY views DESC + display_order (homepage, tours listing, admin)
--    Antes: usa idx_tours_active_order (is_active, display_order) pero debe
--           re-sortear por views DESC → full scan + sort externo
--    Después: B-tree que matchea exactamente el WHERE + ORDER BY + LIMIT
create index if not exists idx_tours_active_views_order
  on public.tours (is_active, views desc, display_order);

-- 2. tour_images: gallery listing global (sin filtrar por tour_id)
--    Antes: no hay índice en display_order → full scan + sort
--    Después: lectura secuencial ordenada, evita sort externo
create index if not exists idx_tour_images_display_order
  on public.tour_images (display_order);

-- 3. reviews: reemplaza idx_reviews_approved_tour con versión que
--    incluye created_at para cubrir también el ORDER BY
--    Antes: filter por (is_approved, tour_id) + sort externo por created_at
--    Después: tour_id primero (alta selectividad) + is_approved + created_at ordenado
drop index if exists idx_reviews_approved_tour;
create index if not exists idx_reviews_tour_approved_created
  on public.reviews (tour_id, is_approved, created_at desc);

-- 4. reviews: listing admin general (todas las reviews ordenadas por fecha)
--    Antes: full scan + sort por created_at DESC
--    Después: lectura directa del final del índice
create index if not exists idx_reviews_created_at
  on public.reviews (created_at desc);

-- 5. reviews: partial index para conteo de pendientes en dashboard admin
--    Solo indexa filas con is_approved = false (~2-5 filas típicamente)
--    Antes: escanea toda la tabla para contar pendientes
--    Después: índice minúsculo de solo las pendientes
create index if not exists idx_reviews_unapproved
  on public.reviews (is_approved)
  where is_approved = false;
