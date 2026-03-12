import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Excluded paths (Login, API, Static)
  const isLoginPage = pathname === '/login';
  const isPublicApi = pathname.startsWith('/api/auth');
  const isStaticFile = pathname.match(/\.(.*)$/) || pathname.startsWith('/_next');

  if (isLoginPage || isPublicApi || isStaticFile) {
    // If logged in and hitting login page, redirect to dashboard
    if (authToken && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Strict check for all other routes
  if (!authToken) {
    const url = new URL('/login', request.url);
    // Add original path as query param for post-login redirect if needed
    // url.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(url);
  }

  // If hitting root directly while logged in, go to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except API, static files, images, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
