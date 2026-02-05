// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import { NextResponse, type NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const token = request.cookies.get("ADMIN_TOKEN")?.value;

  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
