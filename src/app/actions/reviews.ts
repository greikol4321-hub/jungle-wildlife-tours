"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const reviewSchema = z.object({
  author_name: z.string().min(1, "Nombre requerido"),
  author_country: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(1, "Comentario requerido"),
  tour_id: z.uuid(),
});

export async function submitReview(values: unknown) {
  const data = reviewSchema.parse(values);
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    author_name: data.author_name,
    author_country: data.author_country ?? null,
    rating: data.rating,
    comment_es: data.comment,
    tour_id: data.tour_id,
    is_approved: false,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/tours/[slug]");
}

export async function getApprovedReviews(tourId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("tour_id", tourId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}
