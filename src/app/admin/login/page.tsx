"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { Eye, EyeOff, LogIn, TreePalm } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createAdminClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message === "Invalid login credentials" ? "Credenciales inválidas" : "Error al iniciar sesión");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-bg p-4 overflow-hidden admin-section">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald/3 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-emerald/20 animate-ping" style={{ animationDuration: "4s" }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-emerald/15 animate-ping" style={{ animationDuration: "3s", animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-emerald/10 animate-ping" style={{ animationDuration: "5s", animationDelay: "2s" }} />
        <svg className="absolute top-10 left-10 w-32 h-32 text-emerald/[0.02]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 12c0-2.5 1.5-5 4-6 2.5 1 4 3.5 4 6s-1.5 5-4 6c-2.5-1-4-3.5-4-6z" />
        </svg>
        <svg className="absolute bottom-10 right-10 w-40 h-40 text-emerald/[0.02]" viewBox="0 0 24 24" fill="currentColor">
          <TreePalm className="w-full h-full" />
        </svg>
      </div>

      <div className="w-full max-w-sm relative fade-in">
        <div className="text-center mb-8">
          <span className="relative flex h-3 w-3 mx-auto mb-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald" />
          </span>
          <h1 className="font-heading text-xl font-bold text-text">Admin Jungle</h1>
          <p className="text-sm text-text-muted mt-1.5">Inicia sesión para gestionar el sitio</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card slide-up" style={{ animationDelay: "100ms" }}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="email" className="mono-ui text-text-secondary mb-1.5 block">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-input"
                placeholder="admin@ejemplo.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mono-ui text-text-secondary mb-1.5 block">
                CONTRASEÑA
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors active:scale-90"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2 fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" strokeWidth={2} />
                  Ingresar
                </span>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 fade-in" style={{ animationDelay: "200ms" }}>
          <Link href="/" className="text-xs text-text-muted hover:text-emerald transition-colors">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
