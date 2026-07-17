-- Fix: remove old short_description columns, ensure new description columns exist
alter table public.tours
  drop column if exists short_description_es,
  drop column if exists short_description_en;

-- Ensure new columns exist with proper defaults
alter table public.tours
  add column if not exists description_es text,
  add column if not exists description_en text,
  add column if not exists full_description_es text,
  add column if not exists full_description_en text,
  add column if not exists difficulty text,
  add column if not exists min_age integer,
  add column if not exists max_people integer,
  add column if not exists price_usd numeric(10,2),
  add column if not exists child_price_pct integer,
  add column if not exists child_price_usd numeric(10,2),
  add column if not exists languages text[] default '{"Español", "English"}',
  add column if not exists includes text[],
  add column if not exists excludes text[],
  add column if not exists itinerary jsonb;

-- Make description_es/en required for new inserts
alter table public.tours
  alter column description_es set not null,
  alter column description_en set not null;

-- Update existing rows that might have null descriptions
update public.tours
set
  description_es = coalesce(description_es, full_description_es, 'Descripción pendiente'),
  description_en = coalesce(description_en, full_description_en, 'Description pending')
where description_es is null or description_en is null;