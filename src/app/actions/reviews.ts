"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getApprovedReviews as getCachedReviews } from "@/lib/queries";

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
  const supabase = await createClient();

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      author_name: data.author_name,
      author_country: data.author_country ?? null,
      rating: data.rating,
      comment_es: data.comment,
      comment_en: data.comment,
      tour_id: data.tour_id,
      is_approved: false,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  translateReview(review.id, data.comment);

  revalidatePath("/[locale]/tours/[slug]");
  revalidateTag("reviews", "seconds");
}

async function translateReview(id: string, comment: string) {
  try {
    const { translatedText, detectedLang } = await deeplTranslate(comment, "EN");
    let comment_es: string;
    let comment_en: string;
    if (detectedLang === "ES") {
      comment_es = comment;
      comment_en = translatedText;
    } else if (detectedLang === "EN") {
      comment_en = comment;
      comment_es = (await deeplTranslate(comment, "ES")).translatedText;
    } else {
      comment_en = comment;
      comment_es = translatedText;
    }
    const supabase = await createClient();
    await supabase.from("reviews").update({ comment_es, comment_en }).eq("id", id);
  } catch (e) {
    console.error("Background translation failed:", e);
  }
}

export async function getApprovedReviews(tourId: string) {
  return getCachedReviews(tourId);
}
