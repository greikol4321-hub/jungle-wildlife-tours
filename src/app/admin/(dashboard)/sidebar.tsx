"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TreePalm, Star, LogOut, Menu, X } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: TreePalm },
  { href: "/admin/reviews", label: "Reseñas", icon: Star },
] as const;

function NavItems({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return nav.map((item) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className={`admin-sidebar-item ${isActive ? "active" : ""}`}
      >
        <item.icon className="admin-sidebar-icon" strokeWidth={1.5} aria-hidden="true" />
        {item.label}
      </Link>
    );
  });
}

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const displayName = userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-surface border-b border-border">
        <button type="button" onClick={() => setOpen(true)} className="p-2 -ml-2 text-text-muted hover:text-text transition-colors" aria-label="Abrir menú">
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <span className="font-heading font-bold text-sm tracking-wide text-text">Jungle Admin</span>
        <div className="w-9" />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)} role="presentation" />
      )}

      {/* Mobile drawer */}
      <aside className={`
        md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-surface border-r border-border
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <span className="font-heading font-bold text-sm tracking-wide text-text">Jungle Admin</span>
          <button type="button" onClick={() => setOpen(false)} className="p-1 text-text-muted hover:text-text transition-colors" aria-label="Cerrar menú">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-3 pt-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald/10 border border-emerald/15">
            <div className="h-8 w-8 rounded-lg bg-emerald flex items-center justify-center text-white text-sm font-bold leading-none">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text text-sm font-medium leading-tight truncate">{displayName}</p>
              <p className="text-text-muted text-[11px] leading-tight mt-0.5">Administrador</p>
            </div>
            <form action="/admin/logout" method="post">
              <button type="submit" onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Cerrar sesión">
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItems pathname={pathname} onClick={() => setOpen(false)} />
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col admin-sidebar">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-border shrink-0">
          <div className="h-2 w-2 rounded-full bg-emerald animate-pulse-glow" />
          <span className="font-heading font-bold text-sm tracking-wide text-text">Jungle Admin</span>
        </div>
        <div className="px-3 pt-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald/10 border border-emerald/15">
            <div className="h-8 w-8 rounded-lg bg-emerald flex items-center justify-center text-white text-sm font-bold leading-none">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text text-sm font-medium leading-tight truncate">{displayName}</p>
              <p className="text-text-muted text-[11px] leading-tight mt-0.5">Administrador</p>
            </div>
            <form action="/admin/logout" method="post">
              <button type="submit" className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Cerrar sesión">
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItems pathname={pathname} />
        </nav>
      </aside>
    </>
  );
}
