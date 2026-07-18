import { createClient } from "@/lib/supabase/server";
import { ToursTable } from "./tours-table";

export default async function AdminToursPage() {
  const supabase = await createClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Tours</h1>
          <p className="text-sm text-text-muted mt-0.5">Gestiona los tours disponibles</p>
        </div>
      </div>

      <ToursTable tours={tours ?? []} />
    </div>
  );
}