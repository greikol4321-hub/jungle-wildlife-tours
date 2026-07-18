import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const handleI18n = createMiddleware(routing);

const redirects: Record<string, string> = {
  "caminata-manglar-damas": "kayak-manglar-damas",
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = pathname.split("/").pop() ?? "";
  if (redirects[slug]) {
    const newPath = pathname.replace(slug, redirects[slug]);
    return NextResponse.redirect(new URL(newPath, request.url), 308);
  }
  return handleI18n(request);
}

export const config = {
  matcher: "/((?!api|trpc|admin|_next|_vercel|.*\\..*).*)",
};
