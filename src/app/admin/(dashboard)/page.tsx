import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Palmtree, Star, MessageSquare, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ count: tourCount }, { count: reviewCount }, { count: messageCount }, { count: pendingReviews }, { count: newMessages }, { data: recentReviews }, { data: recentMessages }] = await Promise.all([
    supabase.from("tours").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("reviews").select("id, author_name, rating, is_approved, created_at, tours(title_es)").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_messages").select("id, name, email, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-xl font-bold text-text">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard href="/admin/tours" icon={Palmtree} label="Tours" value={tourCount ?? 0} sub="" />
        <StatCard href="/admin/reviews" icon={Star} label="Reseñas" value={reviewCount ?? 0} sub={`${pendingReviews ?? 0} pendientes`} />
        <StatCard href="/admin/messages" icon={MessageSquare} label="Mensajes" value={messageCount ?? 0} sub={`${newMessages ?? 0} nuevos`} />
        <StatCard href="/admin/reviews" icon={Star} label="Pendientes" value={pendingReviews ?? 0} sub="por aprobar" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold text-text">Últimas reseñas</h2>
            <Link href="/admin/reviews" className="text-xs text-text-muted hover:text-emerald flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
          {recentReviews?.length ? (
            <div className="space-y-3">
              {recentReviews.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <span className="text-text font-medium truncate block">{r.author_name}</span>
                    <span className="text-text-muted text-xs">{(r.tours as unknown as { title_es: string } | null)?.title_es}</span>
                  </div>
                  <span className={`text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded-full shrink-0 ${
                    r.is_approved ? "bg-emerald-dim text-emerald" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {r.is_approved ? "APROBADA" : "PENDIENTE"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-6 text-center">Sin reseñas aún</p>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold text-text">Últimos mensajes</h2>
            <Link href="/admin/messages" className="text-xs text-text-muted hover:text-emerald flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
          {recentMessages?.length ? (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <span className="text-text font-medium truncate block">{m.name}</span>
                    <span className="text-text-muted text-xs">{m.email}</span>
                  </div>
                  <span className={`text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded-full shrink-0 ${
                    m.status === "new" ? "bg-blue-500/10 text-blue-400" :
                    m.status === "contacted" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-emerald-dim text-emerald"
                  }`}>
                    {m.status?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-6 text-center">Sin mensajes aún</p>
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
    <Link href={href} className="card p-5 hover:border-emerald/30 transition-all">
      <Icon className="h-5 w-5 text-emerald mb-3" strokeWidth={1.5} />
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-text-muted mt-1">{sub}</p>}
    </Link>
  );
}