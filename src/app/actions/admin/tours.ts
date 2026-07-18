"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const tourSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
  category: z.enum(["day_park", "mangrove", "night_walk"]),
  title_es: z.string().min(1),
  title_en: z.string().min(1),
  description_es: z.string().min(1),
  description_en: z.string().min(1),
  duration_minutes: z.coerce.number().int().positive(),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  min_age: z.coerce.number().int().min(0).optional(),
  max_people: z.coerce.number().int().min(1).optional(),
  price_usd: z.coerce.number().positive().optional(),
  child_price_pct: z.coerce.number().int().min(0).max(100).optional(),
  child_price_usd: z.coerce.number().positive().optional(),
  languages: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    time: z.string(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data: admin } = await supabase
    .from("admin_users").select("user_id").eq("user_id", user.id).single();
  if (!admin) throw new Error("No autorizado");
}

export async function createTour(values: unknown) {
  await verifyAdmin();
  const data = tourSchema.parse(values);
  const supabase = await createClient();
  const { error } = await supabase.from("tours").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
}

export async function updateTour(id: string, values: unknown) {
  await verifyAdmin();
  const data = tourSchema.partial().parse(values);
  const supabase = await createClient();
  const { error } = await supabase.from("tours").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
}

export async function deleteTour(id: string, hard = false) {
  await verifyAdmin();
  const supabase = await createClient();
  if (hard) {
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error?.message?.includes("foreign key")) {
      throw new Error("No se puede eliminar: el tour tiene mensajes de contacto asociados. Desactívalo (soft delete) o elimina los mensajes primero.");
    }
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("tours").update({ is_active: false }).eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
}

export async function toggleTourActive(id: string, isActive: boolean) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("tours").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
}