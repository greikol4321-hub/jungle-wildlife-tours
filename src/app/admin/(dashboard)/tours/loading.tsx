import { SkeletonTable } from "@/components/admin/loading";

export default function Loading() {
  return (
    <div>
      <div className="mb-6">
        <div className="admin-skeleton h-7 w-24" />
        <div className="admin-skeleton h-4 w-44 mt-1.5" />
      </div>
      <SkeletonTable rows={10} />
    </div>
  );
}
