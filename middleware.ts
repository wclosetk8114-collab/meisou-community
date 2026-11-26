import { NextResponse, type NextRequest } from "next/server";

// 公開日（lib/site.ts の releaseAt と同じ）
const RELEASE_AT = Date.parse("2026-12-01T00:00:00+09:00");
// 期間限定の先行オープン（11/28 23:59まで）
const PREOPEN_END = Date.parse("2026-11-29T00:00:00+09:00");
const GATED = ["/", "/course", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 公開前は、トップ・講座案内・登録ページを「Coming soon」に
  if (GATED.includes(pathname) && Date.now() >= PREOPEN_END && Date.now() < RELEASE_AT) {
    if (searchParams.get("preview") === "kuu") {
      const res = NextResponse.next();
      res.cookies.set("kuu_preview", "1", { path: "/", maxAge: 60 * 60 * 24 * 30 });
      return res;
    }
    if (!req.cookies.get("kuu_preview")) {
      const url = req.nextUrl.clone();
      url.pathname = "/coming-soon";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 会員ページ・管理画面はログインが必要
  if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
    if (!req.cookies.get("hm_session")) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/course", "/signup", "/app/:path*", "/admin/:path*"] };
