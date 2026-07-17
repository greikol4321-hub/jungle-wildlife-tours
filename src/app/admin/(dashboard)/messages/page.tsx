import { createClient } from "@/lib/supabase/server";
import { updateMessageStatus, deleteContactMessage } from "@/app/actions/admin/messages";
import { Trash2, Check, Mail, Phone, MessageCircle, X } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-yellow-500/10 text-yellow-400",
  closed: "bg-emerald-dim text-emerald",
};

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
          <h1 className="font-heading text-xl font-bold text-text">Mensajes de contacto</h1>
          <p className="text-sm text-text-muted mt-0.5">{newCount} sin leer</p>
        </div>
      </div>

      <div className="space-y-3">
        {messages?.map((msg) => {
          const canContact = msg.status === "new";
          const canClose = msg.status === "new" || msg.status === "contacted";
          return (
            <div key={msg.id} className={`card p-5 ${msg.status === "new" ? "border-emerald/20" : "opacity-70 hover:opacity-100 transition-opacity"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-sm font-bold text-text">{msg.name}</span>
                    <span className={`text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded-full ${STATUS_STYLES[msg.status ?? "new"]}`}>
                      {msg.status === "new" ? "SIN LEER" : msg.status === "contacted" ? "CONTACTADO" : "CERRADO"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" strokeWidth={1.5} />{msg.email}</span>
                    {msg.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" strokeWidth={1.5} />{msg.phone}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-text-muted font-mono">
                    <span>{new Date(msg.created_at ?? "").toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    {msg.tour_interest && <span>Tour: {msg.tour_interest.title_es}</span>}
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-surface-elevated border border-border/50">
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  {canContact && (
                    <form action={updateMessageStatus.bind(null, msg.id, "contacted")}>
                      <button type="submit" className="p-2 rounded-lg text-text-muted hover:text-emerald hover:bg-emerald-dim transition-all" title="Marcar como contactado">
                        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </form>
                  )}
                  {canClose && (
                    <form action={updateMessageStatus.bind(null, msg.id, "closed")}>
                      <button type="submit" className="p-2 rounded-lg text-text-muted hover:text-emerald hover:bg-emerald-dim transition-all" title="Cerrar">
                        <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </form>
                  )}
                  {msg.status !== "new" && (
                    <form action={updateMessageStatus.bind(null, msg.id, "new")}>
                      <button type="submit" className="p-2 rounded-lg text-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Reabrir">
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </form>
                  )}
                  <form action={deleteContactMessage.bind(null, msg.id)}>
                    <button type="submit" className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all" title="Eliminar"
                      onClick={(e) => { if (!confirm("¿Eliminar mensaje?")) e.preventDefault(); }}>
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
        {(!messages || messages.length === 0) && (
          <p className="text-sm text-text-muted text-center py-12">No hay mensajes.</p>
        )}
      </div>
    </div>
  );
}