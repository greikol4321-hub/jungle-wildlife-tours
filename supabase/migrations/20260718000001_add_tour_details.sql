-- Agregar columnas faltantes a tours para coincidir con demo data
alter table public.tours
  add column if not exists max_people integer,
  add column if not exists languages text[] default '{"Español", "English"}',
  add column if not exists child_price_pct integer,
  add column if not exists child_price_usd numeric(10,2),
  add column if not exists full_description_es text,
  add column if not exists full_description_en text,
  add column if not exists includes text[],
  add column if not exists excludes text[],
  add column if not exists itinerary jsonb;

-- Índice para itinerary jsonb si se consulta
create index if not exists idx_tours_itinerary on public.tours using gin (itinerary);