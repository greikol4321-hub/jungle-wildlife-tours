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

const DEEPL_URL = "https://api-free.deepl.com/v2";

async function deeplTranslate(text: string, targetLang: string): Promise<{ translatedText: string; detectedLang: string }> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY no configurada");

  const res = await fetch(`${DEEPL_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `DeepL-Auth-Key ${apiKey}`,
    },
    body: JSON.stringify({ text: [text], target_lang: targetLang }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`DeepL error ${res.status}: ${body}`);
  }
  const data = await res.json();
  return {
    translatedText: data.translations[0].text,
    detectedLang: data.translations[0].detected_source_language,
  };
}

export async function submitReview(values: unknown) {
  const data = reviewSchema.parse(values);

  let comment_es: string;
  let comment_en: string;

  const { translatedText, detectedLang } = await deeplTranslate(data.comment, "EN");

  if (detectedLang === "ES") {
    comment_es = data.comment;
    comment_en = translatedText;
  } else if (detectedLang === "EN") {
    comment_en = data.comment;
    comment_es = await deeplTranslate(data.comment, "ES").then(r => r.translatedText);
  } else {
    comment_en = data.comment;
    comment_es = translatedText;
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
