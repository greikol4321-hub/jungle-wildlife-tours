create policy "admin select reviews" on public.reviews
  for select using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "cualquiera puede enviar reseña" on public.reviews
  for insert with check (true);

create policy "admins pueden ver todos los tours" on public.tours
  for select using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );
