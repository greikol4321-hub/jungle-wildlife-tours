create extension if not exists "pgcrypto";

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('day_park','mangrove','night_walk')),
  title_es text not null,
  title_en text not null,
  short_description_es text not null,
  short_description_en text not null,
  full_description_es text,
  full_description_en text,
  duration_minutes integer not null,
  difficulty text,
  min_age integer,
  price_usd numeric(10,2),
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table public.tour_images (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references public.tours(id) on delete cascade,
  storage_path text not null,
  alt_text_es text,
  alt_text_en text,
  is_cover boolean default false,
  display_order integer default 0
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_country text,
  rating integer check (rating between 1 and 5),
  comment_es text,
  comment_en text,
  tour_id uuid references public.tours(id) on delete set null,
  is_approved boolean default false,
  created_at timestamptz default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  tour_interest uuid references public.tours(id),
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.tours enable row level security;
alter table public.tour_images enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

create policy "tours activos visibles" on public.tours
  for select using (is_active = true);

create policy "imagenes de tours activos visibles" on public.tour_images
  for select using (
    exists (select 1 from public.tours t where t.id = tour_id and t.is_active = true)
  );

create policy "reseñas aprobadas visibles" on public.reviews
  for select using (is_approved = true);

create policy "cualquiera puede enviar mensaje de contacto" on public.contact_messages
  for insert with check (true);
