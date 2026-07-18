"use client";

import { ToastProvider } from "@/components/admin/toast";

export function DashboardClient({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
