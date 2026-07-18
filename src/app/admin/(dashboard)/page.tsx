import { createClient } from "@/lib/supabase/server";
import { Palmtree, Star, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ count: tourCount }, { count: activeCount }, { count: reviewCount }, { count: pendingReviews }, { data: recentReviews }] = await Promise.all([
    supabase.from("tours").select("*", { count: "exact", head: true }),
    supabase.from("tours").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("reviews").select("id, author_name, rating, is_approved, created_at, tours(title_es)").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Resumen del estado actual</p>
        </div>
        <span className="mono-ui text-text-muted text-[10px]">
          {new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard href="/admin/tours" icon={Palmtree} label="Tours" value={tourCount ?? 0} sub={`${activeCount ?? 0} activos`} />
        <StatCard href="/admin/reviews" icon={Star} label="Reseñas" value={reviewCount ?? 0} sub={`${pendingReviews ?? 0} pendientes`} />
        <StatCard href="/admin/tours" icon={TrendingUp} label="Tours activos" value={activeCount ?? 0} sub="en publicación" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold text-text">Últimas reseñas</h2>
            {(reviewCount ?? 0) > 0 && (
              <Link href="/admin/reviews" className="text-xs text-text-muted hover:text-emerald flex items-center gap-1 transition-colors">
                Ver todas
                <svg className="h-3 w-3" strokeWidth={1.5} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            )}
          </div>
          {recentReviews?.length ? (
            <div className="space-y-3">
              {recentReviews.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm py-2 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <span className="text-text font-medium truncate block">{r.author_name}</span>
                    <span className="text-text-muted text-xs">{(r.tours as unknown as { title_es: string } | null)?.title_es}</span>
                  </div>
                  <span className={`mono-ui px-1.5 py-0.5 rounded-full shrink-0 ml-3 ${r.is_approved ? "bg-emerald-dim text-emerald" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {r.is_approved ? "APROBADA" : "PENDIENTE"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-8 w-8 text-text-muted/30 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm text-text-muted">Aún no hay reseñas</p>
              <p className="text-xs text-text-muted/50 mt-1">Las reseñas aparecerán aquí cuando los clientes las escriban</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ href, icon: Icon, label, value, sub }: {
  href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string; value: number; sub: string;
}) {
  return (
    <Link href={href} className="admin-card p-5 hover:border-emerald/30 transition-all block">
      <Icon className="h-5 w-5 text-emerald mb-3" strokeWidth={1.5} />
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
      {sub && <p className="mono-ui text-text-muted mt-1">{sub}</p>}
    </Link>
  );
}
