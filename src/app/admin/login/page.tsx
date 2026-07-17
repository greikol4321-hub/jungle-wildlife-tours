"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { Eye, EyeOff, LogIn } from "lucide-react";

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
    <div className="flex min-h-dvh items-center justify-center bg-bg p-4 admin-section">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-2 w-2 rounded-full bg-emerald mx-auto animate-pulse-glow mb-3" />
          <h1 className="font-heading text-lg font-bold text-text">Admin Jungle</h1>
          <p className="text-sm text-text-muted mt-1">Inicia sesión para gestionar el sitio</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-6 space-y-4">
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Ingresando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4 w-4" strokeWidth={2} />
                Ingresar
              </span>
            )}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-xs text-text-muted hover:text-emerald transition-colors">
            ← Volver al sitio
          </a>
        </p>
      </div>
    </div>
  );
}