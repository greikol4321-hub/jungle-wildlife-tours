-- Drop old columns that no longer exist in demo data
alter table public.tours
  drop column if exists short_description_es,
  drop column if exists short_description_en;