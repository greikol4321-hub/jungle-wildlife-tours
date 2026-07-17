-- Migración: consolidar short_description + full_description → description
-- Ejecutar en Supabase SQL Editor

-- 1. Añadir nuevas columnas
alter table public.tours
  add column if not exists description_es text,
  add column if not exists description_en text;

-- 2. Copiar datos: prioriza full_description, fallback a short_description
update public.tours
set
  description_es = coalesce(full_description_es, short_description_es),
  description_en = coalesce(full_description_en, short_description_en);

-- 3. Verificar
select id, slug, short_description_es, full_description_es, description_es,
       short_description_en, full_description_en, description_en
from public.tours;

-- 4. (Opcional) Borrar columnas viejas tras confirmar
-- alter table public.tours drop column short_description_es, drop column short_description_en, drop column full_description_es, drop column full_description_en;