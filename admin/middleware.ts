import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/firebase-messaging-sw.js" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("techtians_session")?.value;
  const roleCookie = request.cookies.get("techtians_role")?.value;

  const isLoginPage = pathname === "/login";

  // If visiting /login while already authenticated
  if (isLoginPage && sessionCookie && (roleCookie === "admin" || roleCookie === "teacher")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing any protected page while not authenticated
  if (!sessionCookie && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If role is student -> access denied
  if (sessionCookie && roleCookie === "student" && !isLoginPage) {
    return new NextResponse(
      JSON.stringify({
        error: "Access Denied",
        message: "Students do not have access to Admin and Teacher panels.",
      }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|firebase-messaging-sw.js).*)"],
};
