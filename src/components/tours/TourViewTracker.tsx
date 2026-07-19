"use client";

import { useEffect } from "react";
import { incrementTourView } from "@/app/actions/admin/tour-views";

export function TourViewTracker({ tourId }: { tourId: string }) {
  useEffect(() => {
    const key = `viewed_${tourId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    incrementTourView(tourId);
  }, [tourId]);

  return null;
}
