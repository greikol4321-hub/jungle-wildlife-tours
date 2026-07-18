"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, PenSquare, Eye, EyeOff, Search } from "lucide-react";
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
    <div className="space-y-4">
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
            <Plus className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Nuevo tour
          </button>
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card admin-scrollbar">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-10"></th>
              <th>Título</th>
              <th className="hidden md:table-cell">Slug</th>
              <th>Categoría</th>
              <th className="hidden sm:table-cell">Orden</th>
              <th className="hidden lg:table-cell">Duración</th>
              <th className="hidden lg:table-cell">Precio</th>
              <th className="text-right w-20">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tour) => (
              <tr key={tour.id}>
                <td>
                  <span className={`inline-block w-2 h-2 rounded-full ${tour.is_active ? "bg-emerald" : "bg-text-muted"}`} />
                </td>
                <td className="font-medium">
                  <div className="truncate max-w-[200px]">{tour.title_es}</div>
                  {tour.title_en && (
                    <div className="text-xs text-text-muted truncate">{tour.title_en}</div>
                  )}
                </td>
                <td className="hidden md:table-cell text-text-muted font-mono text-xs">
                  {tour.slug}
                </td>
                <td>
                  <span className="admin-badge">
                    <span className={`w-1.5 h-1.5 rounded-full ${tour.category === "day_park" ? "bg-emerald" : tour.category === "mangrove" ? "bg-sand" : "bg-canopy"}`} />
                    {CATEGORY_LABELS[tour.category] ?? tour.category}
                  </span>
                </td>
                <td className="hidden sm:table-cell text-text-muted font-mono text-xs">
                  #{tour.display_order}
                </td>
                <td className="hidden lg:table-cell text-text-muted">
                  {tour.duration_minutes
                    ? `${Math.floor(tour.duration_minutes / 60)}h ${tour.duration_minutes % 60}m`
                    : "—"}
                </td>
                <td className="hidden lg:table-cell text-text-muted font-mono">
                  {tour.price_usd ? `$${tour.price_usd}` : "—"}
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
                        <PenSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  {search || category !== "all" ? (
                    <div>
                      <p className="text-sm text-text-muted">No se encontraron tours con esos filtros</p>
                      <p className="text-xs text-text-muted/50 mt-1">Probá con otros términos de búsqueda</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-text-muted">No hay tours todavía</p>
                      <Link href="/admin/tours/new" className="inline-flex items-center gap-1.5 text-xs text-emerald hover:text-emerald-bright transition-colors mt-3">
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Crear el primer tour
                      </Link>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted">
        {filtered.length} de {tours.length} tours
      </p>
    </div>
  );
}