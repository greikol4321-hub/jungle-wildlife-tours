import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
      <Sidebar userEmail={user.email ?? ""} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pt-14 md:pt-0 p-4 md:p-6 lg:p-8 overflow-auto admin-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}