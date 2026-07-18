"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createTour } from "@/app/actions/admin/tours";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

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
      router.push("/admin/tours");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al crear tour");
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
            <Field label="Precio niño (USD)" error={errors.child_price_usd?.message}>
              <input {...register("child_price_usd")} type="number" step="0.01" className="admin-input" />
            </Field>
          </div>
        </section>

        {/* ── IDIOMAS E INCLUYE/EXCLUYE ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Idiomas e ítems</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Idiomas (separados por coma)" error={errors.languages?.message}>
              <input {...register("languages")} className="admin-input" placeholder="Español, English" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Incluye (uno por línea)" error={errors.includes?.message}>
              <textarea {...register("includes")} rows={5} className="admin-input admin-textarea" placeholder="Guía naturalista certificado ICT&#10;Transporte ida y vuelta" />
            </Field>
            <Field label="No incluye (uno por línea)" error={errors.excludes?.message}>
              <textarea {...register("excludes")} rows={5} className="admin-input admin-textarea" placeholder="Alimentación y bebidas&#10;Propinas" />
            </Field>
          </div>
        </section>

        {/* ── ITINERARIO ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Itinerario</h2>
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="p-3 rounded-lg border border-border bg-surface-elevated/50">
                <div className="flex items-start justify-between mb-2">
                  <span className="mono-ui text-xs text-text-muted">Paso {i + 1}</span>
                  <button type="button" onClick={() => remove(i)} className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <label className="block mono-ui text-text-secondary mb-1.5">HORA</label>
                    <input {...register(`itinerary.${i}.time`)} className="admin-input" placeholder="8:00" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mono-ui text-text-secondary mb-1.5">TÍTULO</label>
                    <input {...register(`itinerary.${i}.title`)} className="admin-input" placeholder="Inicio del tour" />
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
        </section>

        {/* ── ORDEN ── */}
        <section>
          <h2 className="font-heading text-sm font-bold text-text mb-4 pb-2 border-b border-border">Orden</h2>
          <div className="grid grid-cols-1">
            <Field label="Orden de visualización" error={errors.display_order?.message}>
              <input {...register("display_order")} type="number" className="admin-input" />
            </Field>
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary disabled:opacity-50">
            {saving ? "Creando..." : "Crear tour"}
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
