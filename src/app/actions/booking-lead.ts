"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  phone: z.string().min(1, "Teléfono requerido"),
  message: z.string().min(1),
  tour_id: z.string().optional(),
});

export async function saveBookingLead(values: unknown) {
  const data = leadSchema.parse(values);
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: data.name,
    phone: data.phone,
    message: data.message,
    tour_interest: data.tour_id ?? null,
  });
  if (error) throw new Error(error.message);
}
