import { unstable_cache } from "next/cache";
import { createStaticClient } from "@/lib/supabase/static";

export const getActiveTours = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("tours")
      .select("*, tour_images(*)")
      .eq("is_active", true)
      .order("views", { ascending: false })
      .order("display_order");
    return data ?? [];
  },
  ["tours-active"],
  { revalidate: 60, tags: ["tours"] }
);

export const getFeaturedTours = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("tours")
      .select("*, tour_images(*)")
      .eq("is_active", true)
      .order("views", { ascending: false })
      .order("display_order")
      .limit(3);
    return data ?? [];
  },
  ["tours-featured"],
  { revalidate: 60, tags: ["tours"] }
);

export const getTourBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("tours")
      .select("*, tour_images(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    return data;
  },
  ["tour-slug"],
  { revalidate: 60, tags: ["tours"] }
);

export const getTourSlugs = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("tours")
      .select("slug")
      .eq("is_active", true);
    return data ?? [];
  },
  ["tour-slugs"],
  { revalidate: 60, tags: ["tours"] }
);

export const getGalleryImages = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("tour_images")
      .select("*, tours(slug, title_es, title_en, category)")
      .order("display_order")
      .limit(100);
    return data ?? [];
  },
  ["gallery-images"],
  { revalidate: 60, tags: ["gallery"] }
);

export const getApprovedReviews = unstable_cache(
  async (tourId: string) => {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("tour_id", tourId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    return data ?? [];
  },
  ["reviews-approved"],
  { revalidate: 30, tags: ["reviews"] }
);
