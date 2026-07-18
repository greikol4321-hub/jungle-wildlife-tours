"use client";

import { useState, useMemo } from "react";
import { approveReview, rejectReview, deleteReview } from "@/app/actions/admin/reviews";
import { Check, X, Trash2, Search, Star } from "lucide-react";
import Link from "next/link";

type Review = {
  id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  comment_es: string | null;
  comment_en: string | null;
  is_approved: boolean;
  created_at: string | null;
  tours: { title_es: string } | null;
};

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch = !search
        ? true
        : r.author_name.toLowerCase().includes(q) ||
          r.comment_es?.toLowerCase().includes(q) ||
          r.comment_en?.toLowerCase().includes(q) ||
          r.tours?.title_es?.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" ? true
        : filter === "pending" ? !r.is_approved
        : r.is_approved;
      return matchesSearch && matchesFilter;
    });
  }, [reviews, search, filter]);

  const pending = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar reseñas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <select
          value={filter}
          onChange={(v) => v && setFilter(v.target.value as typeof filter)}
          className="admin-input w-[150px] cursor-pointer appearance-none bg-surface-elevated"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes ({pending})</option>
          <option value="approved">Aprobadas</option>
        </select>
      </div>

      <div className="rounded-lg border border-border bg-card admin-scrollbar">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Autor</th>
              <th>Valoración</th>
              <th className="hidden md:table-cell">Tour</th>
              <th className="hidden sm:table-cell">Comentario</th>
              <th>Fecha</th>
              <th className="text-right w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review) => (
              <tr key={review.id} className={!review.is_approved ? "bg-yellow-500/[0.02]" : ""}>
                <td>
                  <span className={`admin-badge ${review.is_approved ? "active" : "pending"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${review.is_approved ? "bg-emerald" : "bg-yellow-400"}`} />
                    {review.is_approved ? "APROBADA" : "PENDIENTE"}
                  </span>
                </td>
                <td className="font-medium">
                  {review.author_name}
                  {review.author_country && (
                    <span className="block mono-ui text-text-muted mt-0.5">{review.author_country}</span>
                  )}
                </td>
                <td>
                  <span className="font-mono text-xs text-emerald">{review.rating}/5</span>
                </td>
                <td className="hidden md:table-cell text-text-muted text-xs max-w-[140px] truncate">
                  {review.tours?.title_es ?? "—"}
                </td>
                <td className="hidden sm:table-cell text-text-muted text-xs max-w-[200px]">
                  <p className="truncate">{review.comment_es ?? review.comment_en ?? ""}</p>
                </td>
                <td className="text-text-muted font-mono text-[10px] whitespace-nowrap">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString("es", { day: "2-digit", month: "2-digit", year: "numeric" })
                    : "—"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    {!review.is_approved ? (
                      <form action={approveReview.bind(null, review.id)}>
                        <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon" title="Aprobar">
                          <Check className="h-3.5 w-3.5 text-emerald" strokeWidth={2} />
                        </button>
                      </form>
                    ) : (
                      <form action={rejectReview.bind(null, review.id)}>
                        <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon" title="Rechazar">
                          <X className="h-3.5 w-3.5 text-yellow-400" strokeWidth={2} />
                        </button>
                      </form>
                    )}
                    {deleting === review.id ? (
                      <div className="flex items-center gap-0.5">
                        <form action={deleteReview.bind(null, review.id)}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-destructive text-[10px] px-2 w-auto">
                            Confirmar
                          </button>
                        </form>
                        <button onClick={() => setDeleting(null)} className="admin-btn admin-btn-ghost admin-btn-icon">
                          <X className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleting(review.id)}
                        className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  {search || filter !== "all" ? (
                    <div>
                      <p className="text-sm text-text-muted">No se encontraron reseñas con esos filtros</p>
                      <p className="text-xs text-text-muted/50 mt-1">Probá con otros términos de búsqueda</p>
                    </div>
                  ) : (
                    <div>
                      <Star className="h-8 w-8 text-text-muted/30 mx-auto mb-2" strokeWidth={1.5} />
                      <p className="text-sm text-text-muted">No hay reseñas todavía</p>
                      <p className="text-xs text-text-muted/50 mt-1">Las reseñas aparecerán aquí cuando los clientes las escriban</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted">
        {filtered.length} de {reviews.length} reseñas
      </p>
    </div>
  );
}
