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

const schema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
  category: z.enum(["day_park", "mangrove", "night_walk"]),
  title_es: z.string().min(1),
  title_en: z.string().min(1),
  description_es: z.string().min(1),
  description_en: z.string().min(1),
  duration_minutes: z.coerce.number(),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  min_age: z.coerce.number().optional(),
  max_people: z.coerce.number().optional(),
  price_usd: z.coerce.number().optional(),
  child_price_pct: z.coerce.number().optional(),
  child_price_usd: z.coerce.number().optional(),
  languages: z.string().optional(),
  includes: z.string().optional(),
  excludes: z.string().optional(),
  itinerary: z.string().optional(),
  display_order: z.coerce.number().default(0),
});

type FormData = z.infer<typeof schema>;

function dataToForm(tour: Tables<"tours">): FormData {
  return {
    slug: tour.slug,
    category: tour.category as "day_park" | "mangrove" | "night_walk",
    title_es: tour.title_es,
    title_en: tour.title_en,
    description_es: tour.description_es,
    description_en: tour.description_en,
    duration_minutes: tour.duration_minutes,
    difficulty: (tour.difficulty as "easy" | "moderate" | "challenging") ?? undefined,
    min_age: tour.min_age ?? undefined,
    max_people: tour.max_people ?? undefined,
    price_usd: tour.price_usd ?? undefined,
    child_price_pct: tour.child_price_pct ?? undefined,
    child_price_usd: tour.child_price_usd ?? undefined,
    languages: (tour.languages ?? []).join(", "),
    includes: (tour.includes ?? []).join("\n"),
    excludes: (tour.excludes ?? []).join("\n"),
    itinerary: tour.itinerary ? JSON.stringify(tour.itinerary, null, 2) : "",
    display_order: tour.display_order ?? 0,
  };
}

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tour, setTour] = useState<Tables<"tours"> | null>(null);
  const [images, setImages] = useState<Tables<"tour_images">[]>([]);
  const [uploading, setUploading] = useState(false);
  const id = use(params).id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  useEffect(() => {
    async function load() {
      const supabase = createAdminClient();
      const { data: t } = await supabase.from("tours").select("*").eq("id", id).single();
      if (t) {
        setTour(t as Tables<"tours">);
        reset(dataToForm(t as Tables<"tours">));
      }
      const { data: imgs } = await supabase.from("tour_images").select("*").eq("tour_id", id).order("display_order");
      setImages((imgs ?? []) as Tables<"tour_images">[]);
    }
    load();
  }, [id, reset]);

  function onSubmit(raw: FormData) {
    startTransition(async () => {
      try {
        const payload = {
          ...raw,
          languages: raw.languages?.split(",").map(s => s.trim()).filter(Boolean) ?? [],
          includes: raw.includes?.split("\n").map(s => s.trim()).filter(Boolean) ?? [],
          excludes: raw.excludes?.split("\n").map(s => s.trim()).filter(Boolean) ?? [],
          itinerary: raw.itinerary ? JSON.parse(raw.itinerary) : undefined,
        };
        await updateTour(id, payload);
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
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 mono-ui text-text-muted hover:text-emerald transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Volver a tours
      </Link>
      <h1 className="font-heading text-xl font-bold text-text mb-6">Editar tour</h1>

      {/* Images */}
      <div className="admin-card p-5 mb-6">
        <h2 className="font-heading text-sm font-bold text-text mb-3">Imágenes</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-elevated border border-border">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tour-images/${img.storage_path}`}
                alt=""
                className="w-full h-full object-cover"
              />
              {img.is_cover && (
                <span className="absolute top-1 left-1 mono-ui px-1.5 py-0.5 rounded bg-emerald text-bg">
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
        {/* ── INFORMACIÓN BÁSICA ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Información básica</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug" error={errors.slug?.message}>
              <input {...register("slug")} className="admin-input" />
            </Field>
            <Field label="Categoría" error={errors.category?.message}>
              <select {...register("category")} className="admin-input appearance-none cursor-pointer">
                <option value="day_park">Day Park</option>
                <option value="mangrove">Manglar</option>
                <option value="night_walk">Night Walk</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Título (ES)" error={errors.title_es?.message}>
              <input {...register("title_es")} className="admin-input" />
            </Field>
            <Field label="Título (EN)" error={errors.title_en?.message}>
              <input {...register("title_en")} className="admin-input" />
            </Field>
          </div>
        </section>

        {/* ── DESCRIPCIONES ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Descripciones</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Desc. corta (ES)" error={errors.description_es?.message}>
              <textarea {...register("description_es")} rows={3} className="admin-input admin-textarea" />
            </Field>
            <Field label="Desc. corta (EN)" error={errors.description_en?.message}>
              <textarea {...register("description_en")} rows={3} className="admin-input admin-textarea" />
            </Field>
          </div>
        </section>

        {/* ── DURACIÓN Y DIFICULTAD ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Duración y dificultad</h2>
          <div className="grid grid-cols-4 gap-4">
            <Field label="Duración (min)" error={errors.duration_minutes?.message}>
              <input {...register("duration_minutes")} type="number" className="admin-input" />
            </Field>
            <Field label="Dificultad" error={errors.difficulty?.message}>
              <select {...register("difficulty")} className="admin-input appearance-none cursor-pointer">
                <option value="">—</option>
                <option value="easy">Fácil</option>
                <option value="moderate">Moderada</option>
                <option value="challenging">Exigente</option>
              </select>
            </Field>
            <Field label="Edad mínima" error={errors.min_age?.message}>
              <input {...register("min_age")} type="number" className="admin-input" />
            </Field>
            <Field label="Max. personas" error={errors.max_people?.message}>
              <input {...register("max_people")} type="number" className="admin-input" />
            </Field>
          </div>
        </section>

        {/* ── PRECIOS ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Precios</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Precio adulto (USD)" error={errors.price_usd?.message}>
              <input {...register("price_usd")} type="number" step="0.01" className="admin-input" />
            </Field>
            <Field label="Child price %" error={errors.child_price_pct?.message}>
              <input {...register("child_price_pct")} type="number" min={0} max={100} className="admin-input" />
            </Field>
            <Field label="Child price (USD)" error={errors.child_price_usd?.message}>
              <input {...register("child_price_usd")} type="number" step="0.01" className="admin-input" />
            </Field>
          </div>
        </section>

        {/* ── IDIOMAS E INCLUYE/EXCLUYE ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Idiomas e ítems</h2>
          <Field label="Idiomas (separados por coma)" error={errors.languages?.message}>
            <input {...register("languages")} className="admin-input" placeholder="Español, English" />
          </Field>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Incluye (uno por línea)" error={errors.includes?.message}>
              <textarea {...register("includes")} rows={5} className="admin-input admin-textarea" />
            </Field>
            <Field label="No incluye (uno por línea)" error={errors.excludes?.message}>
              <textarea {...register("excludes")} rows={5} className="admin-input admin-textarea" />
            </Field>
          </div>
        </section>

        {/* ── ITINERARIO ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Itinerario (JSON)</h2>
          <Field label="Arreglo de {time, title, description}" error={errors.itinerary?.message}>
            <textarea
              {...register("itinerary")}
              rows={6}
              className="admin-input admin-textarea font-mono text-xs"
            />
          </Field>
        </section>

        {/* ── ORDEN ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Orden</h2>
          <Field label="Orden de visualización" error={errors.display_order?.message}>
            <input {...register("display_order")} type="number" className="admin-input" />
          </Field>
        </section>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary disabled:opacity-50">
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link href="/admin/tours" className="admin-btn admin-btn-ghost">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mono-ui text-text-secondary mb-1.5">{label.toUpperCase()}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
