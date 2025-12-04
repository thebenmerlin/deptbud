import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const isAdmin = token?.role === 'ADMIN';
    const isHOD = token?.role === 'HOD';

    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.rewrite(new URL('/auth/unauthorized', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/reports') && !isAdmin && !isHOD) {
      return NextResponse.rewrite(new URL('/auth/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/budget/:path*',
    '/expenses/:path*',
    '/reports/:path*',
    '/admin/:path*',
  ],
};
