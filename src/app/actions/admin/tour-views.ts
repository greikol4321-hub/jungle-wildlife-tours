"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementTourView(tourId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tours")
    .select("views")
    .eq("id", tourId)
    .single();
  if (data) {
    await supabase
      .from("tours")
      .update({ views: (data.views ?? 0) + 1 })
      .eq("id", tourId);
  }
}
