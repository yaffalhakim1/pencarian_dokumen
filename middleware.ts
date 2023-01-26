import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookie from "js-cookie";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //get token from cookie
  let token = request.headers.get("cookie");
  let token2 = request.cookies.get("token")?.value;
  console.log(token2);
  if (request.nextUrl.pathname === "/" && !token) {
    return NextResponse.rewrite(new URL("/auth/login", request.url));
  }

  if (request.nextUrl.pathname === "/admin" && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (request.nextUrl.pathname === "/users" && !token) {
    return NextResponse.rewrite(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/users/:path*", "/"],
};
