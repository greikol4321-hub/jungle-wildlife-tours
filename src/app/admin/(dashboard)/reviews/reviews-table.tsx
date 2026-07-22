"use client";

import { useState, useMemo, useCallback } from "react";
import { approveReview, rejectReview, deleteReview, approveReviews, deleteReviews } from "@/app/actions/admin/reviews";
import { Check, X, Trash2, Search, MessageSquareQuote } from "lucide-react";

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
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState<{ es: string | null; en: string | null } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  }, [filtered, allSelected]);

  const deselectAll = useCallback(() => setSelectedIds(new Set()), []);

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

      {someSelected && (
        <div className="admin-card flex items-center gap-3 px-4 py-2.5">
          <span className="text-sm text-text font-medium">{selectedIds.size} seleccionadas</span>
          <div className="flex-1" />
          <form action={approveReviews.bind(null, Array.from(selectedIds))} onSubmit={() => setSelectedIds(new Set())}>
            <button type="submit" className="admin-btn admin-btn-sm" style={{ color: "var(--color-emerald)", borderColor: "var(--color-emerald)" }}>
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Aprobar seleccionadas
            </button>
          </form>
          <button
            type="button"
            onClick={() => setShowBulkDeleteModal(true)}
            className="admin-btn admin-btn-sm admin-btn-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Eliminar seleccionadas
          </button>
          <button type="button" onClick={deselectAll} className="admin-btn admin-btn-ghost admin-btn-sm text-xs">
            Deseleccionar
          </button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-x-auto admin-scrollbar">
        <table className="admin-table min-w-[520px]">
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  className="admin-checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Seleccionar todas"
                />
              </th>
              <th className="w-20 sm:w-24">Estado</th>
              <th>Autor</th>
              <th className="w-24 sm:w-28">Valoración</th>
              <th className="hidden md:table-cell">Tour</th>
              <th>Comentario</th>
              <th className="hidden sm:table-cell w-24">Fecha</th>
              <th className="text-right w-28">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((review, i) => (
              <tr
                key={review.id}
                className={`stagger-fade ${selectedIds.has(review.id) ? "bg-surface-elevated/40" : ""}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={selectedIds.has(review.id)}
                    onChange={() => toggleSelect(review.id)}
                    aria-label={`Seleccionar reseña de ${review.author_name}`}
                  />
                </td>
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
                <td className="hidden md:table-cell text-text-muted text-xs max-w-[100px]">
                  <span className="truncate block">{review.tours?.title_es ?? "—"}</span>
                </td>
                <td className="text-text-muted text-xs max-w-[200px]">
                  {review.comment_es || review.comment_en ? (
                    <div className="space-y-1">
                      {review.comment_es && (
                        <p className="truncate cursor-pointer hover:text-text transition-colors before:content-['ES_'] before:text-[9px] before:text-emerald/60 before:font-mono"
                          onClick={() => setShowCommentModal({ es: review.comment_es, en: review.comment_en })}>
                          {review.comment_es}
                        </p>
                      )}
                      {review.comment_en && (
                        <p className="truncate cursor-pointer hover:text-text transition-colors before:content-['EN_'] before:text-[9px] before:text-sand/60 before:font-mono"
                          onClick={() => setShowCommentModal({ es: review.comment_es, en: review.comment_en })}>
                          {review.comment_en}
                        </p>
                      )}
                    </div>
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
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(review.id)}
                      className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-destructive"
                      title="Eliminar"
                      aria-label="Eliminar reseña"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="text-center py-16">
                    {search || filter !== "all" ? (
                      <div>
                        <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                          <Search className="h-6 w-6 text-text-muted/30" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm text-text-muted font-medium">No se encontraron reseñas con esos filtros</p>
                        <p className="text-xs text-text-muted/50 mt-1">Probá con otros términos</p>
                      </div>
                    ) : (
                      <div>
                        <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                          <MessageSquareQuote className="h-6 w-6 text-text-muted/30" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm text-text-muted font-medium">No hay reseñas todavía</p>
                        <p className="text-xs text-text-muted/50 mt-1">Aparecerán cuando los clientes escriban</p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted">
        {filtered.length} de {reviews.length} reseñas
      </p>

      {showDeleteModal && (
        <div className="admin-dialog-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="admin-dialog-content max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-lg font-bold text-text">Eliminar reseña</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Esta acción no se puede deshacer. La reseña se borrará permanentemente.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowDeleteModal(null)} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">
                Cancelar
              </button>
              <form action={deleteReview.bind(null, showDeleteModal)} onSubmit={() => setShowDeleteModal(null)}>
                <button type="submit" className="admin-btn admin-btn-destructive px-4 py-2 text-sm">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteModal && (
        <div className="admin-dialog-overlay" onClick={() => setShowBulkDeleteModal(false)}>
          <div className="admin-dialog-content max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-lg font-bold text-text">Eliminar {selectedIds.size} reseñas</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Esta acción no se puede deshacer. Las reseñas seleccionadas se borrarán permanentemente.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowBulkDeleteModal(false)} className="admin-btn admin-btn-ghost px-4 py-2 text-sm">
                Cancelar
              </button>
              <form action={deleteReviews.bind(null, Array.from(selectedIds))} onSubmit={() => { setShowBulkDeleteModal(false); setSelectedIds(new Set()); }}>
                <button type="submit" className="admin-btn admin-btn-destructive px-4 py-2 text-sm">
                  Eliminar {selectedIds.size} reseñas
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCommentModal && (
        <div className="admin-dialog-overlay" onClick={() => setShowCommentModal(null)}>
          <div className="admin-dialog-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-text">Comentario completo</h3>
              <button type="button" onClick={() => setShowCommentModal(null)} className="admin-btn admin-btn-ghost admin-btn-icon" aria-label="Cerrar">
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-4">
              {showCommentModal.es && (
                <div>
                  <span className="mono-ui text-[9px] tracking-wider text-emerald/60 uppercase">ES</span>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{showCommentModal.es}</p>
                </div>
              )}
              {showCommentModal.en && (
                <div>
                  <span className="mono-ui text-[9px] tracking-wider text-sand/60 uppercase">EN</span>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{showCommentModal.en}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
