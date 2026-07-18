"use client";

import { ToastProvider } from "@/components/admin/toast";

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
