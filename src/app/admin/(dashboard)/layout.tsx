import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Sidebar } from "./sidebar";
import "@/app/admin/admin.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh bg-bg admin-section">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-surface">
          <span className="font-heading font-bold text-sm tracking-wide text-text">Jungle Admin</span>
          <form action="/admin/logout" method="post">
            <button type="submit" className="text-text-muted hover:text-red-400 p-2 focus-visible-ring">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto admin-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}