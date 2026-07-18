"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  tourInterest: z.string().optional(),
});

export async function sendContactMessage(values: unknown) {
  const data = contactSchema.parse(values);

  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    tour_interest: data.tourInterest ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
