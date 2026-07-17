create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

create policy "admin users read own" on public.admin_users
  for select using (auth.uid() = user_id);

-- RLS write policies for admin operations
create policy "admin insert tours" on public.tours
  for insert with check (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin update tours" on public.tours
  for update using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin delete tours" on public.tours
  for delete using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin insert tour_images" on public.tour_images
  for insert with check (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin update tour_images" on public.tour_images
  for update using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin delete tour_images" on public.tour_images
  for delete using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin update reviews" on public.reviews
  for update using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin delete reviews" on public.reviews
  for delete using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin update messages" on public.contact_messages
  for update using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admin delete messages" on public.contact_messages
  for delete using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );