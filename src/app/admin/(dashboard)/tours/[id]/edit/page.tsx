"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { use, useTransition, useState, useEffect } from "react";
import { updateTour } from "@/app/actions/admin/tours";
import { uploadTourImage, deleteTourImage } from "@/app/actions/admin/tour-images";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { ArrowLeft, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
  category: z.enum(["day_park", "mangrove", "night_walk"]),
  title_es: z.string().min(1),
  title_en: z.string().min(1),
  short_description_es: z.string().min(1),
  short_description_en: z.string().min(1),
  full_description_es: z.string().optional(),
  full_description_en: z.string().optional(),
  duration_minutes: z.coerce.number(),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  min_age: z.coerce.number().optional(),
  price_usd: z.coerce.number().optional(),
  display_order: z.coerce.number().default(0),
});

type FormData = {
  slug: string; category: "day_park" | "mangrove" | "night_walk";
  title_es: string; title_en: string;
  short_description_es: string; short_description_en: string;
  full_description_es?: string; full_description_en?: string;
  duration_minutes: number;
  difficulty?: "easy" | "moderate" | "challenging";
  min_age?: number; price_usd?: number;
  display_order: number;
};

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tour, setTour] = useState<Tables<"tours"> | null>(null);
  const [images, setImages] = useState<Tables<"tour_images">[]>([]);
  const [uploading, setUploading] = useState(false);
  const id = use(params).id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema as never),
  });

  useEffect(() => {
    async function load() {
      const supabase = createAdminClient();
      const { data: t } = await supabase.from("tours").select("*").eq("id", id).single();
      if (t) {
        setTour(t as Tables<"tours">);
        reset(t as unknown as FormData);
      }
      const { data: imgs } = await supabase.from("tour_images").select("*").eq("tour_id", id).order("display_order");
      setImages((imgs ?? []) as Tables<"tour_images">[]);
    }
    load();
  }, [id, reset]);

  function onSubmit(values: FormData) {
    startTransition(async () => {
      try {
        await updateTour(id, values);
        router.push("/admin/tours");
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Error al actualizar");
      }
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await uploadTourImage(id, formData);
      const supabase = createAdminClient();
      const { data: imgs } = await supabase.from("tour_images").select("*").eq("tour_id", id).order("display_order");
      setImages(imgs ?? []);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al subir imagen");
    }
    setUploading(false);
  }

  async function handleDeleteImage(imageId: string, storagePath: string) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await deleteTourImage(imageId, storagePath);
      setImages(images.filter((img) => img.id !== imageId));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar imagen");
    }
  }

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-emerald transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Volver a tours
      </Link>
      <h1 className="font-heading text-xl font-bold text-text mb-6">Editar tour</h1>

      {/* Images */}
      <div className="card p-5 mb-6">
        <h2 className="font-heading text-sm font-bold text-text mb-3">Imágenes</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-surface-elevated border border-border">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tour-images/${img.storage_path}`}
                alt=""
                className="w-full h-full object-cover"
              />
              {img.is_cover && (
                <span className="absolute top-1 left-1 text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald text-bg">
                  Cover
                </span>
              )}
              <button
                onClick={() => handleDeleteImage(img.id, img.storage_path)}
                className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-emerald cursor-pointer transition-colors">
          <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
          {uploading ? "Subiendo..." : "Subir imagen"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug" error={errors.slug?.message}>
            <input {...register("slug")} className="input" />
          </Field>
          <Field label="Categoría" error={errors.category?.message}>
            <select {...register("category")} className="input">
              <option value="day_park">Day Park</option>
              <option value="mangrove">Manglar</option>
              <option value="night_walk">Night Walk</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Título (ES)" error={errors.title_es?.message}>
            <input {...register("title_es")} className="input" />
          </Field>
          <Field label="Título (EN)" error={errors.title_en?.message}>
            <input {...register("title_en")} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Desc. corta (ES)" error={errors.short_description_es?.message}>
            <textarea {...register("short_description_es")} rows={3} className="input" />
          </Field>
          <Field label="Desc. corta (EN)" error={errors.short_description_en?.message}>
            <textarea {...register("short_description_en")} rows={3} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Desc. completa (ES)" error={errors.full_description_es?.message}>
            <textarea {...register("full_description_es")} rows={4} className="input" />
          </Field>
          <Field label="Desc. completa (EN)" error={errors.full_description_en?.message}>
            <textarea {...register("full_description_en")} rows={4} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Duración (min)" error={errors.duration_minutes?.message}>
            <input {...register("duration_minutes")} type="number" className="input" />
          </Field>
          <Field label="Dificultad" error={errors.difficulty?.message}>
            <select {...register("difficulty")} className="input">
              <option value="">—</option>
              <option value="easy">Fácil</option>
              <option value="moderate">Moderada</option>
              <option value="challenging">Exigente</option>
            </select>
          </Field>
          <Field label="Orden" error={errors.display_order?.message}>
            <input {...register("display_order")} type="number" className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (USD)" error={errors.price_usd?.message}>
            <input {...register("price_usd")} type="number" step="0.01" className="input" />
          </Field>
          <Field label="Edad mínima" error={errors.min_age?.message}>
            <input {...register("min_age")} type="number" className="input" />
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="btn btn-primary disabled:opacity-50">
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Link href="/admin/tours" className="btn btn-ghost">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-wider text-text-secondary mb-1.5">{label.toUpperCase()}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}