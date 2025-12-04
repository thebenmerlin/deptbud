import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Public routes that don't require auth
    const publicRoutes = ["/login", "/register", "/reset-password"];

    // Check if route is public
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      // If already logged in, redirect to dashboard
      if (token) {
        return NextResponse.redirect(
          new URL("/dashboard", req.nextUrl)
        );
      }
      return NextResponse.next();
    }

    // Protect routes based on role
    const adminRoutes = ["/settings", "/admin"];
    const hodRoutes = ["/expenses/approve", "/reports"];

    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard", req.nextUrl)
        );
      }
    }

    if (hodRoutes.some((route) => pathname.startsWith(route))) {
      if (!["ADMIN", "HOD"].includes(token?.role as string)) {
        return NextResponse.redirect(
          new URL("/dashboard", req.nextUrl)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
