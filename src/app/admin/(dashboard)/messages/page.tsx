import { createClient } from "@/lib/supabase/server";
import { updateMessageStatus, deleteContactMessage } from "@/app/actions/admin/messages";
import { Trash2, Check, Phone, MessageCircle, X, CalendarDays, ChevronRight } from "lucide-react";

function initialColor(name: string): string {
  const palette = [
    "bg-emerald-dim text-emerald",
    "bg-blue-500/10 text-blue-400",
    "bg-purple-500/10 text-purple-400",
    "bg-amber-500/10 text-amber-400",
    "bg-rose-500/10 text-rose-400",
    "bg-cyan-500/10 text-cyan-400",
    "bg-orange-500/10 text-orange-400",
    "bg-pink-500/10 text-pink-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getSource(msg: { message: string; tour_interest: unknown }): { label: string; hint: string } {
  const isBooking = typeof msg.tour_interest === "string" || typeof msg.tour_interest === "object";
  if (isBooking || msg.message.startsWith("🦎")) return { label: "WhatsApp", hint: "Reserva directa" };
  return { label: "Contacto", hint: "Formulario de contacto" };
}

function StatusDot({ status }: { status: string }) {
  if (status === "new") return <span className="absolute top-3 right-3 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-40" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" /></span>;
  return null;
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*, tour_interest(title_es)")
    .order("created_at", { ascending: false });

  const newCount = messages?.filter((m) => m.status === "new").length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Mensajes</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {newCount > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-50" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" /></span>
                {newCount} sin leer
              </span>
            ) : "No hay mensajes nuevos"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {messages?.map((msg) => {
          const color = initialColor(msg.name);
          const source = getSource(msg);
          const isNew = msg.status === "new";

          return (
            <div key={msg.id} className="group relative">
              {/* Status ping dot for new messages */}
              {isNew && <StatusDot status={msg.status} />}

              <div className={`
                relative rounded-xl border transition-all duration-300
                ${isNew
                  ? "bg-surface border-emerald/20 shadow-[0_0_24px_-8px_rgba(78,203,113,0.15)]"
                  : msg.status === "contacted"
                    ? "bg-surface/80 border-border hover:border-yellow-500/20"
                    : "bg-surface/60 border-border opacity-70 hover:opacity-100"
                }
                ${!isNew ? "hover:border-border-strong hover:shadow-sm" : ""}
              `}>
                {/* Status bar — left accent stripe */}
                <div className={`
                  absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl transition-colors duration-300
                  ${isNew ? "bg-emerald" : msg.status === "contacted" ? "bg-yellow-500/60" : "bg-border"}
                `} />

                <div className="p-4 pl-5">
                  {/* Row 1: Avatar + Name + Status + Source */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="admin-avatar shrink-0 mt-0.5">
                      <div className={`admin-avatar-fallback ${color} text-xs font-bold tracking-wide`}>
                        {getInitials(msg.name)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top line: name, status badge, source badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading text-sm font-bold text-text">{msg.name}</span>

                        {/* Status badge */}
                        <span className={`
                          inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-semibold
                          ${isNew ? "bg-emerald-dim text-emerald" : msg.status === "contacted" ? "bg-yellow-500/10 text-yellow-400" : "bg-surface-elevated text-text-muted"}
                        `}>
                          <span className={`
                            w-1.5 h-1.5 rounded-full
                            ${isNew ? "bg-emerald" : msg.status === "contacted" ? "bg-yellow-400" : "bg-text-muted"}
                          `} />
                          {msg.status === "new" ? "Sin leer" : msg.status === "contacted" ? "Contactado" : "Cerrado"}
                        </span>

                        {/* Source badge */}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-semibold bg-surface-elevated text-text-secondary">
                          {source.label === "WhatsApp" ? <MessageCircle className="h-2.5 w-2.5" strokeWidth={2} /> : <CalendarDays className="h-2.5 w-2.5" strokeWidth={2} />}
                          {source.label}
                        </span>
                      </div>

                      {/* Row 2: Email / Phone / Date */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted flex-wrap">
                        <span className="font-mono">{msg.email}</span>
                        {msg.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" strokeWidth={1.5} />
                            {msg.phone}
                          </span>
                        )}
                        <span className="text-[10px] opacity-60">
                          {new Date(msg.created_at ?? "").toLocaleDateString("es", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Tour interest */}
                      {msg.tour_interest && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald/80 bg-emerald-dim/50 px-2 py-0.5 rounded-full">
                            <ChevronRight className="h-3 w-3" strokeWidth={2} />
                            {typeof msg.tour_interest === "object" && "title_es" in (msg.tour_interest ?? {})
                              ? (msg.tour_interest as { title_es: string }).title_es
                              : "Tour consulta"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions — visible on hover */}
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {msg.status === "new" && (
                        <form action={updateMessageStatus.bind(null, msg.id, "contacted")}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Marcar contactado">
                            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </form>
                      )}
                      {(msg.status === "new" || msg.status === "contacted") && (
                        <form action={updateMessageStatus.bind(null, msg.id, "closed")}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Cerrar">
                            <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </form>
                      )}
                      {msg.status !== "new" && (
                        <form action={updateMessageStatus.bind(null, msg.id, "new")}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Reabrir">
                            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </form>
                      )}
                      <form action={deleteContactMessage.bind(null, msg.id)}>
                        <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-destructive !w-8 !h-8" title="Eliminar"
                          onClick={(e) => { if (!confirm("¿Eliminar mensaje?")) e.preventDefault(); }}>
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </form>
                    </div>

                    {/* Always-visible actions on mobile */}
                    <div className="flex items-center gap-0.5 shrink-0 md:hidden">
                      {msg.status === "new" && (
                        <form action={updateMessageStatus.bind(null, msg.id, "contacted")}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Marcar contactado">
                            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </form>
                      )}
                      {(msg.status === "new" || msg.status === "contacted") && (
                        <form action={updateMessageStatus.bind(null, msg.id, "closed")}>
                          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon !w-8 !h-8" title="Cerrar">
                            <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </form>
                      )}
                      <form action={deleteContactMessage.bind(null, msg.id)}>
                        <button type="submit" className="admin-btn admin-btn-ghost admin-btn-icon admin-btn-destructive !w-8 !h-8" title="Eliminar"
                          onClick={(e) => { if (!confirm("¿Eliminar mensaje?")) e.preventDefault(); }}>
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="mt-3 ml-[3.25rem]">
                    <div className={`
                      relative rounded-xl p-3.5 border
                      ${isNew
                        ? "bg-emerald-dim/20 border-emerald/10"
                        : "bg-surface-elevated border-border/50"
                      }
                    `}>
                      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(!messages || messages.length === 0) && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-elevated border border-border mb-3">
              <MessageCircle className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-text-muted">No hay mensajes todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
