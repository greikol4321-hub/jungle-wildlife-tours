"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TreePalm, Star, MessageSquare, LogOut } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: TreePalm },
  { href: "/admin/reviews", label: "Reseñas", icon: Star },
  { href: "/admin/messages", label: "Mensajes", icon: MessageSquare },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <div className="h-2 w-2 rounded-full bg-emerald animate-pulse-glow" />
        <span className="font-heading font-bold text-sm tracking-wide text-text">Jungle Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-emerald-dim text-emerald font-semibold"
                  : "text-text-secondary hover:text-text hover:bg-surface-elevated"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <form action="/admin/logout" method="post">
          <button type="submit" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-red-400 hover:bg-surface-elevated transition-all duration-200">
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}