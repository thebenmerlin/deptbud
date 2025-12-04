import { withAuth } from "next-auth/middleware";

export const middleware = withAuth(function middleware(req) {
  return;
});

export const config = {
  matcher: ["/budget/:path*", "/expenses/:path*", "/dashboard/:path*"],
};
