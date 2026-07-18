"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createTour } from "@/app/actions/admin/tours";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, FileText, Clock, DollarSign, Globe, MapPin, ListOrdered } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/toast";

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
  itinerary: z.array(itineraryItem).optional(),
  display_order: z.coerce.number().default(0),
});

type FormData = z.infer<typeof schema>;

export default function NewTourPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      languages: "Español, English",
      display_order: 0,
      itinerary: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "itinerary" });

  async function onSubmit(raw: FormData) {
    setSaving(true);
    try {
      const payload = {
        ...raw,
        languages: raw.languages?.split(",").map(s => s.trim()).filter(Boolean) ?? [],
        includes: raw.includes?.split("\n").map(s => s.trim()).filter(Boolean) ?? [],
        excludes: raw.excludes?.split("\n").map(s => s.trim()).filter(Boolean) ?? [],
        itinerary: raw.itinerary?.length ? raw.itinerary : undefined,
      };
      await createTour(payload);
      toast("success", "Tour creado correctamente");
      router.push("/admin/tours");
      router.refresh();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Error al crear tour");
    }
    setSaving(false);
  }

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 mono-ui text-text-muted hover:text-emerald transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Volver a tours
      </Link>
      <h1 className="font-heading text-xl font-bold text-text mb-6">Nuevo tour</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="admin-card p-6">
          <SectionHeading icon={FileText} title="Información básica" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug" error={errors.slug?.message}>
              <input {...register("slug")} className="admin-input" placeholder="night-walk-tortuguero" />
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
              <input {...register("title_es")} className="admin-input" placeholder="Tour nocturno Tortuguero" />
            </Field>
            <Field label="Título (EN)" error={errors.title_en?.message}>
              <input {...register("title_en")} className="admin-input" placeholder="Tortuguero Night Walk" />
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
              <input {...register("duration_minutes")} type="number" className="admin-input" placeholder="180" />
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
              <input {...register("min_age")} type="number" className="admin-input" placeholder="0" />
            </Field>
            <Field label="Max. personas" error={errors.max_people?.message}>
              <input {...register("max_people")} type="number" className="admin-input" placeholder="15" />
            </Field>
          </div>
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={DollarSign} title="Precios" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Precio adulto (USD)" error={errors.price_usd?.message}>
              <input {...register("price_usd")} type="number" step="0.01" className="admin-input" placeholder="75" />
            </Field>
            <Field label="Precio niño (USD)" error={errors.child_price_usd?.message}>
              <input {...register("child_price_usd")} type="number" step="0.01" className="admin-input" placeholder="45" />
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
              <textarea {...register("includes")} rows={5} className="admin-input admin-textarea" placeholder="Guía naturalista certificado&#10;Transporte ida y vuelta" />
            </Field>
            <Field label="No incluye (uno por línea)" error={errors.excludes?.message}>
              <textarea {...register("excludes")} rows={5} className="admin-input admin-textarea" placeholder="Alimentación y bebidas&#10;Propinas" />
            </Field>
          </div>
        </div>

        <div className="admin-card p-6">
          <SectionHeading icon={MapPin} title="Itinerario" />
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="p-4 rounded-xl border border-border bg-surface-elevated/30">
                <div className="flex items-start justify-between mb-3">
                  <span className="mono-ui text-[10px] text-text-muted bg-surface px-2 py-0.5 rounded-full">Paso {i + 1}</span>
                  <button type="button" onClick={() => remove(i)} className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors" aria-label={`Eliminar paso ${i + 1}`}>
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
                <Field label="Descripción">
                  <textarea {...register(`itinerary.${i}.description`)} rows={2} className="admin-input admin-textarea" placeholder="Descripción de este paso" />
                </Field>
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

        <div className="flex gap-3 pt-2 pb-8">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary disabled:opacity-50">
            {saving ? "Creando..." : "Crear tour"}
          </button>
          <Link href="/admin/tours" className="admin-btn admin-btn-ghost">Cancelar</Link>
        </div>
      </form>
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
