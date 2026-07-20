"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Json } from "@/types/database";
import { translateToEN, translateArrayToEN } from "@/lib/translate";

const tourSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
  category: z.enum(["day_park", "mangrove", "night_walk"]),
  title_es: z.string().min(1),
  title_en: z.string().optional(),
  description_es: z.string().min(1),
  description_en: z.string().optional(),
  duration_minutes: z.coerce.number().int().positive(),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  min_age: z.coerce.number().int().min(0).optional(),
  max_people: z.coerce.number().int().min(1).optional(),
  price_usd: z.coerce.number().min(0).optional(),
  child_price_usd: z.coerce.number().min(0).optional(),
  child_max_age: z.coerce.number().int().min(1).optional(),
  languages: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  tide_table: z.string().optional(),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

function parseTideTable(raw: string): Json {
  try {
    return JSON.parse(raw) as Json;
  } catch {
    return raw;
  }
}

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

  const [title_en, description_en] = await Promise.all([
    data.title_en || translateToEN(data.title_es),
    data.description_en || translateToEN(data.description_es),
  ]);

  const payload = {
    ...data,
    title_en,
    description_en,
    tide_table: data.tide_table ? parseTideTable(data.tide_table) : null,
    price_usd: data.price_usd || null,
    child_price_usd: data.child_price_usd || null,
    child_max_age: data.child_max_age || null,
  };
  const { error } = await supabase.from("tours").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
  revalidatePath("/admin");
}

export async function updateTour(id: string, values: unknown) {
  await verifyAdmin();
  const data = tourSchema.partial().parse(values);
  const supabase = await createClient();
  const payload: Record<string, unknown> = {
    ...data,
    price_usd: data.price_usd !== undefined ? (data.price_usd || null) : undefined,
    child_price_usd: data.child_price_usd !== undefined ? (data.child_price_usd || null) : undefined,
    child_max_age: data.child_max_age !== undefined ? (data.child_max_age || null) : undefined,
    tide_table: data.tide_table !== undefined ? (data.tide_table ? parseTideTable(data.tide_table) : null) : undefined,
  };
  // Remove undefined keys so supabase doesn't update them
  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined) delete payload[key];
  }
  const { error } = await supabase.from("tours").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
  revalidatePath("/admin");
}

export async function toggleTourActive(id: string, isActive: boolean) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("tours").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidatePath("/[locale]/tours");
  revalidatePath("/admin");
}