"use client";

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, type ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
  createdAt: number;
};

type ToastCtx = {
  toast: (type: ToastType, message: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

let nextId = 0;

const icons = {
  success: <CheckCircle className="h-5 w-5 text-emerald shrink-0" strokeWidth={2} />,
  error: <XCircle className="h-5 w-5 text-red-400 shrink-0" strokeWidth={2} />,
  info: <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" strokeWidth={2} />,
};

const borders: Record<ToastType, string> = {
  success: "border-emerald/20",
  error: "border-red-400/20",
  info: "border-blue-400/20",
};

const bg: Record<ToastType, string> = {
  success: "bg-emerald-dim/40",
  error: "bg-red-500/10",
  info: "bg-blue-500/10",
};

const progressColors: Record<ToastType, string> = {
  success: "bg-emerald",
  error: "bg-red-400",
  info: "bg-blue-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exiting, setExiting] = useState<Set<number>>(new Set());
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    setExiting((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setExiting((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }, 250);
  }, []);

  const cancelTimer = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    const toast: Toast = { id, type, message, createdAt: Date.now() };
    setToasts((prev) => [...prev, toast]);
    const timer = setTimeout(() => remove(id), 4000);
    timers.current.set(id, timer);
  }, [remove]);

  const pauseTimer = useCallback((id: number) => cancelTimer(id), [cancelTimer]);
  const resumeTimer = useCallback((id: number) => {
    if (timers.current.has(id)) return;
    const t = toasts.find((t) => t.id === id);
    if (t) {
      const elapsed = Date.now() - t.createdAt;
      const remaining = Math.max(4000 - elapsed, 0);
      if (remaining > 0) {
        const timer = setTimeout(() => remove(id), remaining);
        timers.current.set(id, timer);
      } else {
        remove(id);
      }
    }
  }, [toasts, remove]);

  useEffect(() => {
    return () => { timers.current.forEach((t) => clearTimeout(t)); };
  }, []);

  const ctx = useMemo(() => ({ toast: addToast }), [addToast]);

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const isExiting = exiting.has(t.id);
          const elapsed = Date.now() - t.createdAt;
          const remaining = Math.max(100 - (elapsed / 4000) * 100, 0);
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-2.5 px-4 pt-3 pb-2.5 rounded-xl border shadow-lg backdrop-blur-sm ${bg[t.type]} ${borders[t.type]} border bg-surface/90 min-w-[280px] max-w-[400px] ${isExiting ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"}`}
              style={{
                transition: isExiting ? "opacity 250ms, transform 250ms" : "opacity 300ms cubic-bezier(0.22,1,0.32,1), transform 300ms cubic-bezier(0.22,1,0.32,1)",
                animation: isExiting ? "none" : "toastIn 300ms cubic-bezier(0.22,1,0.32,1) forwards",
              }}
              onMouseEnter={() => pauseTimer(t.id)}
              onMouseLeave={() => resumeTimer(t.id)}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                {icons[t.type]}
                <p className="text-sm text-text pt-0.5">{t.message}</p>
              </div>
              <button type="button" onClick={() => remove(t.id)} className="text-text-muted hover:text-text transition-colors p-0.5 -m-0.5 shrink-0" aria-label="Cerrar notificación">
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(24px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
