"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useCallback } from "react";

type TideEntry = {
  date: string;
  time: string;
  height_m: number;
  type: "high" | "low";
};

export function TideTableEditor({
  raw,
  onRawChange,
}: {
  raw: string;
  onRawChange: (json: string) => void;
}) {
  const entries: TideEntry[] = useMemo(() => {
    if (!raw) return [];
    try {
      return JSON.parse(raw) as TideEntry[];
    } catch {
      return [];
    }
  }, [raw]);

  const sync = useCallback(
    (next: TideEntry[]) => {
      onRawChange(next.length > 0 ? JSON.stringify(next) : "");
    },
    [onRawChange]
  );

  function addEntry() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    sync([...entries, { date: dateStr, time: "06:00", height_m: 1.0, type: "high" }]);
  }

  function updateEntry(i: number, field: keyof TideEntry, value: string | number) {
    const next = entries.map((e, idx) =>
      idx === i ? { ...e, [field]: field === "height_m" ? Number(value) : value } : e
    );
    sync(next);
  }

  function removeEntry(i: number) {
    sync(entries.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block mono-ui text-text-secondary">ENTRADAS DE MAREA</label>
        <button
          type="button"
          onClick={addEntry}
          className="admin-btn admin-btn-ghost text-xs flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Agregar entrada
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-text-muted/60 italic py-2">
          No hay entradas de marea. Agregá una para mostrar la tabla en el tour.
        </p>
      )}

      <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
        <span className="mono-ui text-[10px] text-text-muted w-[140px]">FECHA</span>
        <span className="mono-ui text-[10px] text-text-muted w-[110px]">HORA</span>
        <span className="mono-ui text-[10px] text-text-muted w-[80px]">ALTURA</span>
        <span className="mono-ui text-[10px] text-text-muted w-[90px]">TIPO</span>
        <span className="w-[34px]" />
      </div>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-3 rounded-xl border border-border bg-surface-elevated/30"
          >
            <input
              type="date"
              value={entry.date}
              onChange={(e) => updateEntry(i, "date", e.target.value)}
              className="admin-input w-[140px] text-xs"
            />
            <input
              type="time"
              value={entry.time}
              onChange={(e) => updateEntry(i, "time", e.target.value)}
              className="admin-input w-[110px] text-xs"
            />
            <input
              type="number"
              step="0.1"
              value={entry.height_m}
              onChange={(e) => updateEntry(i, "height_m", e.target.value)}
              className="admin-input w-[80px] text-xs"
              placeholder="Altura"
            />
            <select
              value={entry.type}
              onChange={(e) => updateEntry(i, "type", e.target.value)}
              className="admin-input w-[90px] text-xs appearance-none cursor-pointer"
            >
              <option value="high">Alta</option>
              <option value="low">Baja</option>
            </select>
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors shrink-0"
              aria-label="Eliminar entrada"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { TideEntry };
