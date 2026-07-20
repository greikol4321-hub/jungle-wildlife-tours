"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data: admin } = await supabase
    .from("admin_users").select("user_id").eq("user_id", user.id).single();
  if (!admin) throw new Error("No autorizado");
}

export async function uploadTourImage(tourId: string, formData: FormData) {
  await verifyAdmin();
  const file = formData.get("file") as File;
  if (!file) throw new Error("Archivo requerido");
  const supabase = await createClient();
  const ext = file.name.split(".").pop();
  const path = `${tourId}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("tour-images")
    .upload(path, file);
  if (uploadError) throw new Error(uploadError.message);
  const { error: insertError } = await supabase.from("tour_images").insert({
    tour_id: tourId,
    storage_path: path,
  });
  if (insertError) {
    await supabase.storage.from("tour-images").remove([path]);
    throw new Error(insertError.message);
  }
  revalidatePath("/admin/tours");
  revalidateTag("tours", "seconds");
  revalidateTag("gallery", "seconds");
}

export async function deleteTourImage(id: string, storagePath: string) {
  await verifyAdmin();
  const supabase = await createClient();
  await supabase.storage.from("tour-images").remove([storagePath]);
  const { error } = await supabase.from("tour_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/tours");
  revalidateTag("tours", "seconds");
  revalidateTag("gallery", "seconds");
}

export async function setTourCover(tourId: string, imageId: string) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error: resetError } = await supabase.from("tour_images").update({ is_cover: false }).eq("tour_id", tourId);
  if (resetError) throw new Error(resetError.message);
  const { error: setError } = await supabase.from("tour_images").update({ is_cover: true }).eq("id", imageId);
  if (setError) throw new Error(setError.message);
  revalidatePath("/admin/tours");
  revalidateTag("tours", "seconds");
  revalidateTag("gallery", "seconds");
}