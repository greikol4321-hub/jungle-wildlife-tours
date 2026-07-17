-- ============================================================
-- MÓDULO 01 — Indexing: índices para eliminar full scans
-- ============================================================

-- tours: búsqueda por is_active + ordenamiento (usado en homepage, listing)
-- cubre: WHERE is_active = true ORDER BY display_order
create index if not exists idx_tours_active_order
  on public.tours (is_active, display_order);

-- tours: búsqueda por slug (detail page — slug ya tiene UNIQUE index,
-- pero este composite evita filter adicional de is_active)
create index if not exists idx_tours_slug_active
  on public.tours (slug, is_active);

-- tour_images: FK join con tours en tour detail
-- indexed en todos los JOIN: tours → tour_images
create index if not exists idx_tour_images_tour_id
  on public.tour_images (tour_id);

-- tour_images: ordenamiento dentro de cada tour + gallery listing
-- cubre: ORDER BY display_order en gallery y nested tour_images
create index if not exists idx_tour_images_tour_order
  on public.tour_images (tour_id, display_order);

-- contact_messages: ordenamiento por fecha (admin panel)
create index if not exists idx_contact_messages_created
  on public.contact_messages (created_at desc);

-- contact_messages: filtro por estado (admin)
create index if not exists idx_contact_messages_status
  on public.contact_messages (status);

-- reviews: RLS filter + FK (cuando se activen reseñas)
create index if not exists idx_reviews_approved_tour
  on public.reviews (is_approved, tour_id);
