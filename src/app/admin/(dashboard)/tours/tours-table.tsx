"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Trees, Waves, Moon, Eye, EyeOff, Pencil } from "lucide-react";
import { toggleTourActive } from "@/app/actions/admin/tours";

type TourImage = { storage_path: string; is_cover: boolean };
type Tour = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  category: string;
  is_active: boolean;
  display_order: number;
  duration_minutes: number | null;
  price_usd: number | null;
  difficulty: string | null;
  tour_images: TourImage[];
};

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  day_park: { label: "Day Park", icon: <Trees className="h-3.5 w-3.5" />, color: "text-emerald bg-emerald-dim border-emerald/20" },
  mangrove: { label: "Manglar", icon: <Waves className="h-3.5 w-3.5" />, color: "text-sand bg-sand-dim border-sand/20" },
  night_walk: { label: "Night Walk", icon: <Moon className="h-3.5 w-3.5" />, color: "text-blue-400 bg-blue-500/10 border-blue-400/20" },
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "text-emerald bg-emerald-dim",
  moderate: "text-yellow-400 bg-yellow-500/10",
  challenging: "text-rose-400 bg-rose-500/10",
};

function TourThumb({ images }: { images: TourImage[] }) {
  const cover = images?.find((i) => i.is_cover) ?? images?.[0];
  if (!cover) {
    return (
      <div className="w-12 h-12 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
        <Trees className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 bg-surface-elevated">
      <img
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/tour-images/${cover.storage_path}`}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function ToursTable({ tours }: { tours: Tour[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch = !search
        ? true
        : t.title_es.toLowerCase().includes(q) ||
          t.title_en?.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q);
      const matchesCategory = category === "all" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [tours, search, category]);

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(v) => v && setCategory(v.target.value)}
          className="admin-input w-[140px] cursor-pointer appearance-none bg-surface-elevated"
        >
          <option value="all">Todas</option>
          <option value="day_park">Day Park</option>
          <option value="mangrove">Manglar</option>
          <option value="night_walk">Night Walk</option>
        </select>
        <Link href="/admin/tours/new" className="ml-auto">
          <button className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nuevo tour
          </button>
        </Link>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.map((tour) => {
          const cat = CATEGORY_META[tour.category] ?? CATEGORY_META.day_park;
          const diffStyle = tour.difficulty ? DIFFICULTY_STYLES[tour.difficulty] : null;
          const durationStr = tour.duration_minutes
            ? `${Math.floor(tour.duration_minutes / 60)}h ${tour.duration_minutes % 60}m`
            : null;

          return (
            <div
              key={tour.id}
              className={`
                group relative rounded-xl border transition-all duration-300
                ${tour.is_active
                  ? "bg-surface border-border hover:border-emerald/20 hover:shadow-[0_0_24px_-8px_rgba(78,203,113,0.08)]"
                  : "bg-surface/50 border-border/60 opacity-60 hover:opacity-100 hover:border-border"}
              `}
            >
              {/* Status stripe */}
              <div className={`
                absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl transition-colors duration-300
                ${tour.is_active ? "bg-emerald" : "bg-border"}
              `} />

              <div className="p-3 pl-5">
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <TourThumb images={tour.tour_images} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading text-sm font-bold text-text truncate max-w-[240px]">
                        {tour.title_es}
                      </span>
                      <span className={`
                        inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-semibold border
                        ${cat.color}
                      `}>
                        {cat.icon}
                        {cat.label}
                      </span>
                      {!tour.is_active && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-semibold bg-surface-elevated text-text-muted">
                          <EyeOff className="h-2.5 w-2.5" strokeWidth={2} />
                          Inactivo
                        </span>
                      )}
                      {diffStyle && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-semibold ${diffStyle}`}>
                          {tour.difficulty === "easy" ? "Fácil" : tour.difficulty === "moderate" ? "Moderado" : "Exigente"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted flex-wrap">
                      {tour.title_en && (
                        <span className="truncate max-w-[200px]">{tour.title_en}</span>
                      )}
                      <span className="font-mono text-[11px] opacity-60">#{tour.display_order}</span>
                      {durationStr && (
                        <span className="text-[11px]">{durationStr}</span>
                      )}
                      {tour.price_usd && (
                        <span className="font-mono text-emerald/80">${tour.price_usd}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions — visible on hover desktop, always on mobile */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-md:hidden">
                    <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)}>
                      <button className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title={tour.is_active ? "Desactivar" : "Activar"}>
                        {tour.is_active ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      </button>
                    </form>
                    <Link href={`/admin/tours/${tour.id}/edit`}>
                      <button className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Editar">
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </Link>
                  </div>

                  {/* Always-visible actions mobile */}
                  <div className="flex items-center gap-0.5 shrink-0 md:hidden">
                    <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)}>
                      <button className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title={tour.is_active ? "Desactivar" : "Activar"}>
                        {tour.is_active ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      </button>
                    </form>
                    <Link href={`/admin/tours/${tour.id}/edit`}>
                      <button className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Editar">
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-elevated border border-border mb-3">
              <Trees className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-text-muted">
              {search || category !== "all"
                ? "No se encontraron tours con esos filtros."
                : "No hay tours todavía."}
            </p>
          </div>
        )}
      </div>

      {tours.length > 0 && (
        <p className="text-xs text-text-muted px-1">
          {filtered.length} de {tours.length} tours
        </p>
      )}
    </div>
  );
}
