"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const statusSchema = z.enum(["new", "contacted", "closed"]);

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data: admin } = await supabase
    .from("admin_users").select("user_id").eq("user_id", user.id).single();
  if (!admin) throw new Error("No autorizado");
}

export async function updateMessageStatus(id: string, status: string) {
  await verifyAdmin();
  const parsed = statusSchema.parse(status);
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status: parsed })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteContactMessage(id: string) {
  await verifyAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}