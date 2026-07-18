"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, PenSquare, Eye, EyeOff, Search, Clock, DollarSign, Hash, Trees } from "lucide-react";
import { toggleTourActive } from "@/app/actions/admin/tours";

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
};

const CATEGORY_LABELS: Record<string, string> = {
  day_park: "Day Park",
  mangrove: "Manglar",
  night_walk: "Night Walk",
};

const CATEGORY_COLORS: Record<string, string> = {
  day_park: "border-l-emerald",
  mangrove: "border-l-sand",
  night_walk: "border-l-canopy",
};

const CATEGORY_DOTS: Record<string, string> = {
  day_park: "bg-emerald",
  mangrove: "bg-sand",
  night_walk: "bg-canopy",
};

function formatDuration(min: number | null): string {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
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
          <button type="button" className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Nuevo tour
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((tour) => (
          <div
            key={tour.id}
            className={`admin-card p-5 border-l-[3px] ${CATEGORY_COLORS[tour.category] ?? "border-l-emerald"} hover:border-l-emerald transition-all`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${tour.is_active ? "bg-emerald" : "bg-text-muted"}`} />
                  <span className="mono-ui text-[9px] text-text-muted">{tour.slug}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-text leading-tight truncate">{tour.title_es}</h3>
                {tour.title_en && (
                  <p className="text-xs text-text-muted truncate mt-0.5">{tour.title_en}</p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 mono-ui text-[9px] px-2 py-1 rounded-full shrink-0 ${
                tour.category === "day_park" ? "bg-emerald-dim text-emerald" :
                tour.category === "mangrove" ? "bg-sand-dim text-sand" :
                "bg-canopy-deep text-canopy"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOTS[tour.category] ?? "bg-emerald"}`} />
                {CATEGORY_LABELS[tour.category] ?? tour.category}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-muted mb-4 flex-wrap">
              {tour.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {formatDuration(tour.duration_minutes)}
                </span>
              )}
              {tour.price_usd && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" strokeWidth={1.5} />
                  ${tour.price_usd}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" strokeWidth={1.5} />
                #{tour.display_order}
              </span>
              {tour.difficulty && (
                <span className="mono-ui text-[9px] text-text-muted/60">
                  {tour.difficulty === "easy" ? "Fácil" : tour.difficulty === "moderate" ? "Media" : "Exigente"}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)}>
                <button
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                    tour.is_active
                      ? "bg-emerald-dim text-emerald hover:bg-emerald-dim/80"
                      : "bg-text-muted/10 text-text-muted hover:bg-text-muted/20"
                  }`}
                  title={tour.is_active ? "Desactivar" : "Activar"}
                >
                  {tour.is_active ? <Eye className="h-3 w-3" strokeWidth={1.5} /> : <EyeOff className="h-3 w-3" strokeWidth={1.5} />}
                  {tour.is_active ? "Activo" : "Inactivo"}
                </button>
              </form>
              <Link
                href={`/admin/tours/${tour.id}/edit`}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-surface-elevated text-text-secondary hover:text-emerald hover:bg-emerald-dim transition-colors"
              >
                <PenSquare className="h-3 w-3" strokeWidth={1.5} />
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          {search || category !== "all" ? (
            <div>
              <Trees className="h-10 w-10 text-text-muted/20 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-text-muted">No se encontraron tours con esos filtros</p>
              <p className="text-xs text-text-muted/50 mt-1">Probá con otros términos</p>
            </div>
          ) : (
            <div>
              <Trees className="h-10 w-10 text-text-muted/20 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-text-muted">No hay tours todavía</p>
              <Link href="/admin/tours/new" className="inline-flex items-center gap-1.5 text-xs text-emerald hover:text-emerald-bright transition-colors mt-3">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Crear el primer tour
              </Link>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-text-muted">
        {filtered.length} de {tours.length} tours
      </p>
    </div>
  );
}
