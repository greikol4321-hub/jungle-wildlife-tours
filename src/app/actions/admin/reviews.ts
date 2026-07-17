"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const reviewSchema = z.object({
  author_name: z.string().min(1),
  author_country: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment_es: z.string().optional(),
  comment_en: z.string().optional(),
  tour_id: z.string().uuid().optional(),
  is_approved: z.boolean().default(false),
});

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data: admin } = await supabase
    .from("admin_users").select("user_id").eq("user_id", user.id).single();
  if (!admin) throw new Error("No autorizado");
}

export async function createReview(values: unknown) {
  await verifyAdmin();
  const data = reviewSchema.parse(values);
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function approveReview(id: string) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function rejectReview(id: string) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ is_approved: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function updateReview(id: string, values: unknown) {
  await verifyAdmin();
  const data = reviewSchema.partial().parse(values);
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}