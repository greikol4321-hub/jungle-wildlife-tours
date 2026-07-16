insert into storage.buckets (id, name, public) values ('tour-images', 'tour-images', true)
on conflict (id) do nothing;

create policy "tour images public read" on storage.objects
  for select using (bucket_id = 'tour-images');

create policy "tour images insert authenticated" on storage.objects
  for insert with check (bucket_id = 'tour-images');
