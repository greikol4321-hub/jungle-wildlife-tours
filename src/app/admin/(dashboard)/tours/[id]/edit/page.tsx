"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { use, useTransition, useState, useEffect, useRef } from "react";
import { updateTour } from "@/app/actions/admin/tours";
import { uploadTourImage, deleteTourImage, setTourCover } from "@/app/actions/admin/tour-images";
import { createAdminClient } from "@/lib/supabase/admin-client";
import Image from "next/image";
import { ArrowLeft, Plus, Trash2, Upload, FileText, Clock, DollarSign, Globe, MapPin, ListOrdered } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/types/database";
import { useToast } from "@/components/admin/toast";
import { TideTableEditor } from "@/components/admin/TideTableEditor";

const itineraryItem = z.object({
  time: z.string().min(1, "Requerido"),
  title: z.string().min(1, "Requerido"),
  description: z.string().min(1, "Requerido"),
});

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
  child_price_usd: z.coerce.number().optional(),
  languages: z.string().optional(),
  includes: z.string().optional(),
  excludes: z.string().optional(),
  tide_table: z.string().optional(),
  itinerary: z.array(itineraryItem).optional(),
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
    child_price_usd: tour.child_price_usd ?? undefined,
    languages: (tour.languages ?? []).join(", "),
    includes: (tour.includes ?? []).join("\n"),
    excludes: (tour.excludes ?? []).join("\n"),
    tide_table: tour.tide_table ? JSON.stringify(tour.tide_table, null, 2) : "",
    itinerary: (tour.itinerary as { time: string; title: string; description: string }[] | null) ?? [],
    display_order: tour.display_order ?? 0,
  };
}

function ImagePreview({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt="" width={1200} height={800} className="max-h-[90vh] w-auto rounded-xl" />
        <button type="button" onClick={onClose} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const tourRef = useRef<Tables<"tours"> | null>(null);
  const [images, setImages] = useState<Tables<"tour_images">[]>([]);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteImage, setConfirmDeleteImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const id = use(params).id;

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "itinerary" });

  useEffect(() => {
    async function load() {
      const supabase = createAdminClient();
      const { data: t } = await supabase.from("tours").select("*").eq("id", id).single();
      if (t) {
        tourRef.current = t as Tables<"tours">;
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
          itinerary: raw.itinerary?.length ? raw.itinerary : undefined,
        };
        await updateTour(id, payload);
        toast("success", "Tour actualizado correctamente");
        router.push("/admin/tours");
        router.refresh();
      } catch (e) {
        toast("error", e instanceof Error ? e.message : "Error al actualizar");
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
      toast("success", "Imagen subida correctamente");
      const supabase = createAdminClient();
      const { data: imgs } = await supabase.from("tour_images").select("*").eq("tour_id", id).order("display_order");
      setImages(imgs ?? []);
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Error al subir imagen");
    }
    setUploading(false);
  }

  async function handleDeleteImage(imageId: string, storagePath: string) {
    try {
      await deleteTourImage(imageId, storagePath);
      toast("success", "Imagen eliminada");
      setImages(images.filter((img) => img.id !== imageId));
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Error al eliminar imagen");
    }
  }

  async function handleSetCover(imageId: string) {
    try {
      await setTourCover(id, imageId);
      toast("success", "Cover actualizado");
      setImages(images.map((img) => ({ ...img, is_cover: img.id === imageId })));
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Error al cambiar cover");
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
            <div key={img.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-surface-elevated border border-border cursor-pointer" onClick={() => setPreviewImage(img.storage_path)}>
              <Image
                src={img.storage_path}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
              />
              {img.is_cover ? (
                <span className="absolute top-1 left-1 mono-ui px-1.5 py-0.5 rounded bg-emerald text-bg text-[10px]">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(img.id)}
                  className="absolute top-1 left-1 mono-ui px-1.5 py-0.5 rounded bg-surface/80 text-text-muted hover:text-emerald hover:bg-emerald-dim text-[10px] transition-colors opacity-0 group-hover:opacity-100"
                >
                  Cover
                </button>
              )}
              {confirmDeleteImage === img.id ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => { setConfirmDeleteImage(null); handleDeleteImage(img.id, img.storage_path); }}
                    className="text-[10px] px-2 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors"
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteImage(null)}
                    className="text-[10px] px-2 py-1 rounded bg-surface text-text-muted hover:text-text transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteImage(img.id)}
                  className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Eliminar imagen"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={2} />
                </button>
              )}
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="admin-card p-6">
          <SectionHeading icon={FileText} title="Información básica" />
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
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={FileText} title="Descripciones" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Desc. corta (ES)" error={errors.description_es?.message}>
              <textarea {...register("description_es")} rows={3} className="admin-input admin-textarea" />
            </Field>
            <Field label="Desc. corta (EN)" error={errors.description_en?.message}>
              <textarea {...register("description_en")} rows={3} className="admin-input admin-textarea" />
            </Field>
          </div>
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={Clock} title="Duración y dificultad" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={DollarSign} title="Precios" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Precio adulto (USD)" error={errors.price_usd?.message}>
              <input {...register("price_usd")} type="number" step="0.01" className="admin-input" />
            </Field>
            <Field label="Precio niño (USD)" error={errors.child_price_usd?.message}>
              <input {...register("child_price_usd")} type="number" step="0.01" className="admin-input" />
            </Field>
          </div>
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={Globe} title="Idiomas e ítems" />
          <Field label="Idiomas (separados por coma)" error={errors.languages?.message}>
            <input {...register("languages")} className="admin-input" placeholder="Español, English" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Incluye (uno por línea)" error={errors.includes?.message}>
              <textarea {...register("includes")} rows={5} className="admin-input admin-textarea" />
            </Field>
            <Field label="No incluye (uno por línea)" error={errors.excludes?.message}>
              <textarea {...register("excludes")} rows={5} className="admin-input admin-textarea" />
            </Field>
          </div>
        </div>

        {watch("category") === "mangrove" && (
          <div className="admin-card p-6">
            <SectionHeading icon={Globe} title="Tabla de mareas" />
            <TideTableEditor raw={watch("tide_table") ?? ""} onRawChange={(json) => setValue("tide_table", json)} />
          </div>
        )}

        <div className="admin-card p-6">
          <SectionHeading icon={MapPin} title="Itinerario" />
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="p-4 rounded-xl border border-border bg-surface-elevated/30">
                <div className="flex items-start justify-between mb-3">
                  <span className="mono-ui text-[10px] text-text-muted bg-surface px-2 py-0.5 rounded-full">Paso {i + 1}</span>
                  <button type="button" onClick={() => remove(i)} className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors" aria-label="Eliminar paso">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block mono-ui text-text-secondary mb-1.5 text-[10px]">
                      HORA
                      <input {...register(`itinerary.${i}.time`)} className="admin-input" placeholder="8:00" />
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mono-ui text-text-secondary mb-1.5 text-[10px]">
                      TÍTULO
                      <input {...register(`itinerary.${i}.title`)} className="admin-input" placeholder="Inicio del tour" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block mono-ui text-text-secondary mb-1.5 text-[10px]">
                    DESCRIPCIÓN
                    <textarea {...register(`itinerary.${i}.description`)} rows={2} className="admin-input admin-textarea" placeholder="Descripción de este paso" />
                  </label>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => append({ time: "", title: "", description: "" })} className="admin-btn admin-btn-ghost text-xs flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Agregar paso
            </button>
          </div>
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={ListOrdered} title="Orden" />
          <div className="max-w-[200px]">
            <Field label="Orden de visualización" error={errors.display_order?.message}>
              <input {...register("display_order")} type="number" className="admin-input" />
            </Field>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary disabled:opacity-50">
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link href="/admin/tours" className="admin-btn admin-btn-ghost">Cancelar</Link>
        </div>
      </form>

      {previewImage && (
        <ImagePreview src={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
      <div className="w-7 h-7 rounded-lg bg-emerald-dim flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-emerald" strokeWidth={1.5} />
      </div>
      <h2 className="font-heading text-sm font-bold text-text tracking-wide">{title}</h2>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mono-ui text-text-secondary mb-1.5">{label.toUpperCase()}{children}</label>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
