import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { TreePalm, Star, SquarePen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TourStatusList } from "@/components/admin/TourStatusList";

const dateStr = new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const accentMap: Record<string, string> = {
  emerald: "after:bg-emerald",
  sand: "after:bg-sand",
  canopy: "after:bg-canopy",
};

export default async function AdminDashboard() {
  noStore();
  const supabase = await createClient();
  const [{ count: tourCount }, { count: activeCount }, { count: reviewCount }, { count: pendingReviews }, { data: recentReviews }, { data: tours }] = await Promise.all([
    supabase.from("tours").select("*", { count: "exact", head: true }),
    supabase.from("tours").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("reviews").select("id, author_name, rating, is_approved, created_at, tours(title_es)").order("created_at", { ascending: false }).limit(6),
    supabase.from("tours").select("id, slug, title_es, title_en, category, is_active, views").order("views", { ascending: false }).order("display_order"),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="mono-ui text-emerald text-[11px] tracking-[0.25em] mb-2">
          {dateStr}
        </p>
        <h1 className="font-heading text-2xl font-bold text-text">Panel de control</h1>
        <p className="text-sm text-text-muted mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
        <MetricBox value={tourCount ?? 0} label="Tours totales" sub={`${activeCount ?? 0} activos`} accent="emerald" />
        <MetricBox value={reviewCount ?? 0} label="Reseñas" sub={`${pendingReviews ?? 0} pendientes`} accent="sand" />
        <MetricBox value={activeCount ?? 0} label="Tours activos" sub="en publicación" accent="canopy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-sm font-bold text-text tracking-wide">Actividad reciente</h2>
            {(reviewCount ?? 0) > 0 && (
              <Link href="/admin/reviews" className="mono-ui text-[10px] text-text-muted hover:text-emerald flex items-center gap-1.5 transition-colors">
                Ver todo <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            )}
          </div>
          {recentReviews?.length ? (
            <div className="space-y-0 divide-y divide-border/50">
              {recentReviews.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-[11px] font-mono text-text-muted group-hover:text-emerald transition-colors">
                    {r.rating}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text font-medium truncate">{r.author_name}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {(r.tours as unknown as { title_es: string } | null)?.title_es ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`mono-ui text-[9px] px-2 py-0.5 rounded-full ${r.is_approved ? "bg-emerald-dim text-emerald" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {r.is_approved ? "APROBADA" : "PENDIENTE"}
                    </span>
                    <span className="mono-ui text-[9px] text-text-muted/50 hidden sm:block">
                      {new Date(r.created_at ?? "").toLocaleDateString("es", { day: "2-digit", month: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Star className="h-8 w-8 text-text-muted/20 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-text-muted">Aún no hay reseñas</p>
              <p className="text-xs text-text-muted/50 mt-1">Aparecerán aquí cuando los clientes escriban</p>
            </div>
          )}
        </div>

        <div className="admin-card p-6">
          <h2 className="font-heading text-sm font-bold text-text tracking-wide mb-5">Accesos rápidos</h2>
          <div className="space-y-2">
            <QuickLink href="/admin/tours/new" icon={SquarePen} label="Nuevo tour" sub="Crear un tour desde cero" />
            <QuickLink href="/admin/reviews" icon={Star} label="Moderar reseñas" sub={`${pendingReviews} pendientes`} />
            <QuickLink href="/admin/tours" icon={TreePalm} label="Gestionar tours" sub="Editar, activar, ordenar" />
          </div>
        </div>
      </div>

      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-heading text-sm font-bold text-text tracking-wide">Tours</h2>
          <Link href="/admin/tours" className="mono-ui text-[10px] text-text-muted hover:text-emerald flex items-center gap-1.5 transition-colors">
            Gestionar <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
        <p className="text-xs text-text-muted mb-5">{activeCount ?? 0} activos de {tourCount ?? 0} totales</p>
        <TourStatusList tours={tours ?? []} />
      </div>
    </div>
  );
}

function MetricBox({ value, label, sub, accent }: { value: number; label: string; sub: string; accent: string }) {
  return (
    <div className={`bg-surface p-5 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] ${accentMap[accent] ?? "after:bg-emerald"}`}>
      <p className="text-3xl font-bold text-text font-heading leading-none">{value}</p>
      <p className="text-xs text-text-muted mt-2">{label}</p>
      <p className="mono-ui text-[9px] text-text-muted/50 mt-1">{sub}</p>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-[1px]" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`h-3 w-3 ${s <= rating ? "text-sand" : "text-text-muted/20"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function QuickLink({ href, icon: Icon, label, sub }: { href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; sub: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-elevated/50 transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-emerald-dim flex items-center justify-center shrink-0 group-hover:bg-emerald-dim/80 transition-colors">
        <Icon className="h-4 w-4 text-emerald" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text font-medium">{label}</p>
        <p className="mono-ui text-[9px] text-text-muted/60 mt-0.5">{sub}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-text-muted/30 group-hover:text-emerald transition-colors" strokeWidth={1.5} />
    </Link>
  );
}
