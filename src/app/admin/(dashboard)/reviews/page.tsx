import { createClient } from "@/lib/supabase/server";
import { ReviewsTable } from "./reviews-table";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, tours(title_es)")
    .order("created_at", { ascending: false });

  const pending = reviews?.filter((r) => !r.is_approved).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">Reseñas</h1>
          <p className="text-sm text-text-muted mt-0.5">{pending} pendientes de aprobación</p>
        </div>
      </div>

      <ReviewsTable reviews={reviews ?? []} />
    </div>
  );
}
