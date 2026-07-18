"use client";

import { useState, useMemo } from "react";
import { approveReview, rejectReview, deleteReview } from "@/app/actions/admin/reviews";
import { Check, X, Trash2, Search, Star, MessageSquareQuote } from "lucide-react";

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

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "sm" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className="inline-flex gap-[1px]" aria-label={`${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${cls} ${s <= rating ? "text-sand" : "text-text-muted/15"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

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
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
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
          className="admin-input w-[160px] cursor-pointer appearance-none bg-surface-elevated"
          aria-label="Filtrar reseñas"
        >
          <option value="all">Todas las reseñas</option>
          <option value="pending">Pendientes ({pending})</option>
          <option value="approved">Aprobadas</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden admin-scrollbar">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-24">Estado</th>
              <th>Autor</th>
              <th className="w-28">Valoración</th>
              <th className="hidden md:table-cell">Tour</th>
              <th className="hidden sm:table-cell">Comentario</th>
              <th className="hidden sm:table-cell w-24">Fecha</th>
              <th className="text-right w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review) => (
              <tr
                key={review.id}
                className={!review.is_approved ? "border-l-2 border-l-yellow-400/40" : ""}
              >
                <td>
                  <span className={`admin-badge ${review.is_approved ? "active" : "pending"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${review.is_approved ? "bg-emerald" : "bg-yellow-400"}`} />
                    {review.is_approved ? "APROBADA" : "PENDIENTE"}
                  </span>
                </td>
                <td className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-dim flex items-center justify-center text-[10px] font-bold text-emerald shrink-0">
                      {review.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-text">{review.author_name}</span>
                      {review.author_country && (
                        <span className="block text-text-muted font-mono text-[9px] tracking-wider">{review.author_country}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <Stars rating={review.rating} />
                  <span className="block text-[10px] text-text-muted font-mono mt-0.5">{review.rating}/5</span>
                </td>
                <td className="hidden md:table-cell text-text-muted text-xs max-w-[140px]">
                  <span className="truncate block">{review.tours?.title_es ?? "—"}</span>
                </td>
                <td className="hidden sm:table-cell text-text-muted text-xs max-w-[220px]">
                  {(review.comment_es ?? review.comment_en) ? (
                    <p className="truncate">{review.comment_es ?? review.comment_en}</p>
                  ) : (
                    <span className="text-text-muted/40 italic">Sin comentario</span>
                  )}
                </td>
                <td className="hidden sm:table-cell text-text-muted font-mono text-[10px] whitespace-nowrap">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Costa_Rica" })
                    : "—"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    {!review.is_approved ? (
                      <form action={approveReview.bind(null, review.id)}>
                        <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon" title="Aprobar" aria-label="Aprobar reseña">
                          <Check className="h-3.5 w-3.5 text-emerald" strokeWidth={2} />
                        </button>
                      </form>
                    ) : (
                      <form action={rejectReview.bind(null, review.id)}>
                        <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon" title="Rechazar" aria-label="Rechazar reseña">
                          <X className="h-3.5 w-3.5 text-yellow-400" strokeWidth={2} />
                        </button>
                      </form>
                    )}
                    {deleting === review.id ? (
                      <div className="flex items-center gap-0.5">
                        <form action={deleteReview.bind(null, review.id)}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-destructive text-[10px] px-2.5 py-1 h-auto rounded-full">
                            Confirmar
                          </button>
                        </form>
                        <button type="button" onClick={() => setDeleting(null)} className="admin-btn admin-btn-ghost admin-btn-icon" aria-label="Cancelar">
                          <X className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleting(review.id)}
                        className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-destructive"
                        title="Eliminar"
                        aria-label="Eliminar reseña"
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
                      <p className="text-xs text-text-muted/50 mt-1">Probá con otros términos</p>
                    </div>
                  ) : (
                    <div>
                      <MessageSquareQuote className="h-10 w-10 text-text-muted/20 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-sm text-text-muted">No hay reseñas todavía</p>
                      <p className="text-xs text-text-muted/50 mt-1">Aparecerán cuando los clientes escriban</p>
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
