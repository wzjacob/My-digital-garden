import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const ADMIN_PATHS = ["/upload", "/manage"];

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 未配置 ADMIN_SECRET 时不保护（方便本地开发）
  if (!ADMIN_SECRET) {
    return NextResponse.next();
  }

  // 登录页放行
  if (pathname === "/admin-login" || pathname === "/admin-login/") {
    return NextResponse.next();
  }

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_key")?.value;
  if (token === ADMIN_SECRET) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin-login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/upload", "/upload/:path*", "/manage", "/manage/:path*", "/admin-login", "/admin-login/"],
};
