-- Atomic view increment (no SELECT before UPDATE)
create or replace function increment_tour_view(tour_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update tours
  set views = coalesce(views, 0) + 1
  where id = tour_id;
end;
$$;
