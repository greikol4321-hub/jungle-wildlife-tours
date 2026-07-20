"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementTourView(tourId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_tour_view", { tour_id: tourId });
}
