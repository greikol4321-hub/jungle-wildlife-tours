"use client";

import { toggleTourActive } from "@/app/actions/admin/tours";
import { Eye, EyeOff, Trees, Trophy } from "lucide-react";
import Link from "next/link";

type Tour = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  category: string;
  is_active: boolean;
  views: number;
};

export function TourStatusList({ tours }: { tours: Tour[] }) {
  const maxViews = Math.max(...tours.map((t) => t.views ?? 0), 0);

  if (tours.length === 0) {
    return (
      <div className="text-center py-10">
        <Trees className="h-8 w-8 text-text-muted/20 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-sm text-text-muted">No hay tours todavía</p>
        <Link href="/admin/tours/new" className="text-xs text-emerald hover:text-emerald-bright transition-colors mt-2 inline-block">
          Crear tour
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-border/50">
      {tours.map((tour) => {
        const isPopular = maxViews > 0 && tour.views === maxViews;
        return (
          <div key={tour.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${tour.is_active ? "bg-emerald" : "bg-text-muted/30"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-text font-medium truncate">{tour.title_es}</p>
                {isPopular && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-dim text-emerald text-[10px] font-semibold tracking-wider uppercase shrink-0">
                    <Trophy className="h-3 w-3" strokeWidth={1.5} />
                    Popular
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted truncate">{tour.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono-ui text-[11px] text-text-muted/50">
                {tour.views ?? 0} vistas
              </span>
              <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)}>
                <button type="submit"
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full transition-colors ${
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
