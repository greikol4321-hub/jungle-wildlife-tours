const PROJECT_ID = "pxujzdhvftpzupaszzna";

export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = new URLSearchParams();
  params.set("width", String(width));
  params.set("quality", String(quality ?? 85));
  return `https://${PROJECT_ID}.supabase.co/storage/v1/render/image/public/tour-images/${src}?${params}`;
}
