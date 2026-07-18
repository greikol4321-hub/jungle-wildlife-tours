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

const LT_URL = "https://libretranslate.com";

async function libretranslate(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${LT_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LibreTranslate error ${res.status}: ${text}`);
  }
  return res.json();
}

async function detectLanguage(text: string): Promise<string> {
  const data = await libretranslate("/detect", { q: text });
  return data[0]?.language ?? "en";
}

async function translate(text: string, target: string): Promise<string> {
  const data = await libretranslate("/translate", {
    q: text, source: "auto", target, format: "text",
  });
  return data.translatedText ?? text;
}

export async function submitReview(values: unknown) {
  const data = reviewSchema.parse(values);

  const lang = await detectLanguage(data.comment);
  let comment_es: string;
  let comment_en: string;

  if (lang === "es") {
    comment_es = data.comment;
    comment_en = await translate(data.comment, "en");
  } else if (lang === "en") {
    comment_en = data.comment;
    comment_es = await translate(data.comment, "es");
  } else {
    comment_en = data.comment;
    comment_es = await translate(data.comment, "es");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    author_name: data.author_name,
    author_country: data.author_country ?? null,
    rating: data.rating,
    comment_es,
    comment_en,
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
