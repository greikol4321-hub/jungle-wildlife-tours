"use client";

export function ViewsChart({ data }: { data: { name: string; views: number }[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <div>
      <h3 className="font-heading text-xs font-bold text-text tracking-wide mb-4">Visitas por tour</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((d) => (
          <div key={d.name} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[10px] text-text-muted font-medium">{d.views}</span>
            <div
              className="w-full rounded-t-sm transition-all duration-500 ease-emil-spring"
              style={{
                height: `${(d.views / max) * 100}%`,
                backgroundColor: "#4ECB71",
                minHeight: d.views > 0 ? 4 : 0,
              }}
            />
            <span className="text-[10px] text-text-muted text-center leading-tight">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
