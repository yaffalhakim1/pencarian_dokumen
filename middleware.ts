import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie } from "cookies-next";

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith("/api/admin");
};

export function middleware(request: NextRequest) {
  // const url = request.nextUrl.clone();
  // url.pathname = "/auth/login";
  // //==================//
  // const { pathname } = request.nextUrl;
  // const role = request.headers.get("Authorization");
  // //====check token if exist continue if not redirect to login page====//
  // const token = getCookie("token");
  // token ? NextResponse.next() : NextResponse.redirect(url);
  // //====check role if not admin then go to unauthorized====//
  // if (isAdminRoute(pathname) && role !== "admin") {
  //   return NextResponse.redirect(
  //     new URL("/api/auth/unauthorized", request.url)
  //   );
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|login|).*)", "/api/admin/:path*"],
};
