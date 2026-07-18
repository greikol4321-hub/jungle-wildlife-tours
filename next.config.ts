import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/supabase/images.ts",
  },
  async redirects() {
    return [
      {
        source: "/:locale/tours/kayak-manglar-damas",
        destination: "/:locale/tours/caminata-manglar-damas",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");
export default withNextIntl(nextConfig);
