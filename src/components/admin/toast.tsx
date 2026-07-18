"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
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

const borders = {
  success: "border-emerald/20",
  error: "border-red-400/20",
  info: "border-blue-400/20",
};

const bg = {
  success: "bg-emerald-dim/40",
  error: "bg-red-500/10",
  info: "bg-blue-500/10",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const ctx = useMemo(() => ({ toast: addToast }), [addToast]);

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg
              animate-fade-up backdrop-blur-sm
              ${bg[t.type]} ${borders[t.type]} border bg-surface/90
              min-w-[280px] max-w-[400px]
            `}
            style={{ animation: "toastIn 300ms cubic-bezier(0.22,1,0.32,1) forwards" }}
          >
            {icons[t.type]}
            <p className="text-sm text-text flex-1 pt-0.5">{t.message}</p>
            <button type="button" onClick={() => remove(t.id)} className="text-text-muted hover:text-text transition-colors p-0.5 -m-0.5" aria-label="Cerrar notificación">
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ))}
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
