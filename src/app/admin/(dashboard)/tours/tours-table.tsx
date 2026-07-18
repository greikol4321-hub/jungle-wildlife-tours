"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Eye, EyeOff, Search, Trees, Waves, Moon, Pencil } from "lucide-react";
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

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  day_park: { label: "Day Park", icon: <Trees className="h-3.5 w-3.5" />, color: "bg-emerald-dim text-emerald border-emerald/20" },
  mangrove: { label: "Manglar", icon: <Waves className="h-3.5 w-3.5" />, color: "bg-sand-dim text-sand border-sand/20" },
  night_walk: { label: "Night Walk", icon: <Moon className="h-3.5 w-3.5" />, color: "bg-blue-500/10 text-blue-400 border-blue-400/20" },
};

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

  const statusDots: Record<string, string> = {
    day_park: "bg-emerald",
    mangrove: "bg-sand",
    night_walk: "bg-blue-400",
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter + New */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(v) => v && setCategory(v.target.value)}
          className="admin-input w-[130px] cursor-pointer appearance-none bg-surface-elevated text-sm"
        >
          <option value="all">Todas</option>
          <option value="day_park">Day Park</option>
          <option value="mangrove">Manglar</option>
          <option value="night_walk">Night Walk</option>
        </select>
        <Link href="/admin/tours/new" className="ml-auto shrink-0">
          <button className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </Link>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-2">
        {filtered.map((tour) => {
          const cat = CATEGORY_META[tour.category] ?? CATEGORY_META.day_park;
          return (
            <div key={tour.id} className={`rounded-xl border p-3.5 transition-colors ${tour.is_active ? "bg-surface border-border" : "bg-surface/50 border-border/60 opacity-60"}`}>
              <div className="flex items-center gap-3">
                {/* Category icon */}
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg border ${cat.color}`}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-text truncate">{tour.title_es}</span>
                    <span className={`shrink-0 w-2 h-2 rounded-full ${tour.is_active ? "bg-emerald" : "bg-text-muted"}`} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest border ${cat.color}`}>
                      {cat.icon}
                      {cat.label}
                    </span>
                    {tour.price_usd && <span className="font-mono text-emerald/80">${tour.price_usd}</span>}
                    <span>#{tour.display_order}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)} className="flex-1">
                  <button className="admin-btn admin-btn-ghost w-full text-xs py-2">
                    {tour.is_active ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                    {tour.is_active ? "Desactivar" : "Activar"}
                  </button>
                </form>
                <Link href={`/admin/tours/${tour.id}/edit`} className="flex-1">
                  <button className="admin-btn admin-btn-ghost w-full text-xs py-2">
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Editar
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            <Trees className="h-8 w-8 mx-auto mb-2 opacity-30" strokeWidth={1.5} />
            {search || category !== "all" ? "No se encontraron tours." : "No hay tours."}
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block rounded-lg border border-border bg-card admin-scrollbar">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-10"></th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Orden</th>
              <th>Precio</th>
              <th>Duración</th>
              <th className="text-right w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tour) => {
              const cat = CATEGORY_META[tour.category] ?? CATEGORY_META.day_park;
              return (
                <tr key={tour.id}>
                  <td>
                    <span className={`inline-block w-2 h-2 rounded-full ${tour.is_active ? "bg-emerald" : "bg-text-muted"}`} />
                  </td>
                  <td className="font-medium">
                    <div className="truncate max-w-[220px]">{tour.title_es}</div>
                    {tour.title_en && (
                      <div className="text-xs text-text-muted truncate max-w-[220px]">{tour.title_en}</div>
                    )}
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest border ${cat.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[tour.category] ?? "bg-text-muted"}`} />
                      {cat.label}
                    </span>
                  </td>
                  <td className="text-text-muted font-mono text-xs">
                    #{tour.display_order}
                  </td>
                  <td className="text-text-muted font-mono">
                    {tour.price_usd ? <span className="text-emerald/80">${tour.price_usd}</span> : "—"}
                  </td>
                  <td className="text-text-muted">
                    {tour.duration_minutes
                      ? `${Math.floor(tour.duration_minutes / 60)}h ${tour.duration_minutes % 60}m`
                      : "—"}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)}>
                        <button className="admin-btn admin-btn-ghost admin-btn-icon" title={tour.is_active ? "Desactivar" : "Activar"}>
                          {tour.is_active ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                        </button>
                      </form>
                      <Link href={`/admin/tours/${tour.id}/edit`}>
                        <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Editar">
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-text-muted">
                  {search || category !== "all" ? "No se encontraron tours." : "No hay tours."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted px-1">
        {filtered.length} de {tours.length} tours
      </p>
    </div>
  );
}
