"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TreePalm, Star, LogOut } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: TreePalm },
  { href: "/admin/reviews", label: "Reseñas", icon: Star },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
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
              className={`admin-sidebar-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="admin-sidebar-icon" strokeWidth={1.5} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <form action="/admin/logout" method="post">
          <button type="submit" className="admin-btn admin-btn-ghost w-full justify-start">
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}