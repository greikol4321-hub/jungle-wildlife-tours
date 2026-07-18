import { createClient } from "@/lib/supabase/server";
import { Trees, Moon, Waves } from "lucide-react";
import { ToursTable } from "./tours-table";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  day_park: <Trees className="h-3.5 w-3.5" />,
  mangrove: <Waves className="h-3.5 w-3.5" />,
  night_walk: <Moon className="h-3.5 w-3.5" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  day_park: "Day Park",
  mangrove: "Manglar",
  night_walk: "Night Walk",
};

const CATEGORY_COLORS: Record<string, string> = {
  day_park: "text-emerald bg-emerald-dim",
  mangrove: "text-sand bg-sand-dim",
  night_walk: "text-blue-400 bg-blue-500/10",
};

export default async function AdminToursPage() {
  const supabase = await createClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*, tour_images(*)")
    .order("display_order");

  const list = tours ?? [];
  const active = list.filter((t) => t.is_active);
  const byCategory = (cat: string) => list.filter((t) => t.category === cat);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Tours</h1>
          <p className="text-sm text-text-muted mt-0.5">{active.length} activos de {list.length} total</p>
        </div>
      </div>

      {/* Category stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {["day_park", "mangrove", "night_walk"].map((cat) => {
          const count = byCategory(cat).length;
          const activeCount = byCategory(cat).filter((t) => t.is_active).length;
          return (
            <div key={cat} className="rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-border-strong">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={CATEGORY_COLORS[cat] + " p-1 rounded-lg"}>{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs font-mono tracking-wider text-text-secondary">{CATEGORY_LABELS[cat]}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-lg font-bold text-text">{count}</span>
                <span className="text-[11px] text-text-muted">
                  {activeCount} activos
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ToursTable tours={list} />
    </div>
  );
}
