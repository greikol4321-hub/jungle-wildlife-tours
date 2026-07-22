export function SkeletonCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl bg-surface p-5">
          <div className="admin-skeleton h-8 w-16" />
          <div className="admin-skeleton h-3 w-24 mt-3" />
          <div className="admin-skeleton h-2.5 w-20 mt-2" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="admin-card">
      <div className="p-6">
        <div className="admin-skeleton h-10 w-full rounded-xl mb-6" />
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i}>
                    <div className="admin-skeleton h-3 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, r) => (
                <tr key={r}>
                  {[1, 2, 3, 4, 5].map((c) => (
                    <td key={c}>
                      <div className="admin-skeleton h-4 w-full max-w-[160px]" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6 max-w-xl">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <div className="admin-skeleton h-3 w-24" />
          <div className="admin-skeleton h-10 w-full rounded-xl" />
        </div>
      ))}
      <div className="admin-skeleton h-10 w-32 rounded-full" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="admin-skeleton h-3 w-48" />
        <div className="admin-skeleton h-8 w-64" />
        <div className="admin-skeleton h-4 w-40" />
      </div>

      <SkeletonCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="admin-skeleton h-4 w-32" />
              <div className="admin-skeleton h-3 w-20" />
            </div>
            <div className="admin-skeleton h-64 w-full rounded-xl" />
          </div>
        </div>

        <div className="admin-card">
          <div className="p-6">
            <div className="admin-skeleton h-4 w-28 mb-5" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="admin-skeleton h-9 w-9 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="admin-skeleton h-3.5 w-28" />
                    <div className="admin-skeleton h-2.5 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SkeletonTable rows={5} />
    </div>
  );
}
