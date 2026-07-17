import { createClient } from "@/lib/supabase/server";
import { approveReview, rejectReview, deleteReview } from "@/app/actions/admin/reviews";
import { Check, X, Trash2 } from "lucide-react";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, tours(title_es)")
    .order("created_at", { ascending: false });

  const pending = reviews?.filter((r) => !r.is_approved).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Reseñas</h1>
          <p className="text-sm text-text-muted mt-0.5">{pending} pendientes de aprobación</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-mono tracking-wider text-text-muted">
              <Th>Estado</Th>
              <Th>Autor</Th>
              <Th>Rating</Th>
              <Th>Tour</Th>
              <Th>Comentario</Th>
              <Th>Fecha</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {reviews?.map((review) => (
              <tr key={review.id} className={`border-b border-border/50 last:border-0 hover:bg-surface-elevated/50 transition-colors ${!review.is_approved ? "bg-yellow-500/[0.02]" : ""}`}>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded-full ${
                    review.is_approved ? "bg-emerald-dim text-emerald" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${review.is_approved ? "bg-emerald" : "bg-yellow-400"}`} />
                    {review.is_approved ? "APROBADA" : "PENDIENTE"}
                  </span>
                </td>
                <td className="p-3 font-medium text-text">
                  {review.author_name}
                  {review.author_country && <span className="text-text-muted text-[10px] block">{review.author_country}</span>}
                </td>
                <td className="p-3">
                  <span className="font-mono text-emerald text-xs">{review.rating}/5</span>
                </td>
                <td className="p-3 text-text-muted text-[11px] max-w-[140px] truncate">
                  {review.tours?.title_es ?? "—"}
                </td>
                <td className="p-3 text-text-muted max-w-[200px]">
                  <p className="truncate">{review.comment_es ?? review.comment_en ?? ""}</p>
                </td>
                <td className="p-3 text-text-muted text-[11px] font-mono whitespace-nowrap">
                  {new Date(review.created_at ?? "").toLocaleDateString("es", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    {!review.is_approved ? (
                      <form action={approveReview.bind(null, review.id)}>
                        <button type="submit" className="p-1.5 rounded-lg text-text-muted hover:text-emerald hover:bg-emerald-dim transition-all" title="Aprobar">
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </form>
                    ) : (
                      <form action={rejectReview.bind(null, review.id)}>
                        <button type="submit" className="p-1.5 rounded-lg text-text-muted hover:text-yellow-400 hover:bg-yellow-500/10 transition-all" title="Rechazar">
                          <X className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </form>
                    )}
                    <form action={deleteReview.bind(null, review.id)}>
                      <button type="submit" className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Eliminar"
                        onClick={(e) => { if (!confirm("¿Eliminar reseña?")) e.preventDefault(); }}>
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!reviews || reviews.length === 0) && (
          <p className="text-sm text-text-muted text-center py-12">No hay reseñas.</p>
        )}
      </div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`p-3 font-medium ${className ?? ""}`}>{children}</th>;
}