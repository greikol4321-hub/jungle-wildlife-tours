"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createTour } from "@/app/actions/admin/tours";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  price_usd: z.coerce.number().optional(),
  display_order: z.coerce.number().default(0),
});

type FormData = {
  slug: string; category: "day_park" | "mangrove" | "night_walk";
  title_es: string; title_en: string;
  description_es: string; description_en: string;
  duration_minutes: number;
  difficulty?: "easy" | "moderate" | "challenging";
  min_age?: number; price_usd?: number;
  display_order: number;
};

export default function NewTourPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema as never),
  });

  function onSubmit(values: FormData) {
    try {
      createTour(values);
      router.push("/admin/tours");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al crear tour");
    }
  }

  return (
    <div>
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 mono-ui text-text-muted hover:text-emerald transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Volver a tours
      </Link>
      <h1 className="font-heading text-xl font-bold text-text mb-6">Nuevo tour</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Título (ES)" error={errors.title_es?.message}>
            <input {...register("title_es")} className="admin-input" />
          </Field>
          <Field label="Título (EN)" error={errors.title_en?.message}>
            <input {...register("title_en")} className="admin-input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Desc. (ES)" error={errors.description_es?.message}>
            <textarea {...register("description_es")} rows={4} className="admin-input admin-textarea" />
          </Field>
          <Field label="Desc. (EN)" error={errors.description_en?.message}>
            <textarea {...register("description_en")} rows={4} className="admin-input admin-textarea" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
          <Field label="Orden" error={errors.display_order?.message}>
            <input {...register("display_order")} type="number" className="admin-input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (USD)" error={errors.price_usd?.message}>
            <input {...register("price_usd")} type="number" step="0.01" className="admin-input" />
          </Field>
          <Field label="Edad mínima" error={errors.min_age?.message}>
            <input {...register("min_age")} type="number" className="admin-input" />
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="admin-btn admin-btn-primary">Crear tour</button>
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