import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if session token cookie exists
  const token = request.cookies.get('token')?.value;
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboard && !token) {
    // Redirect unauthenticated traffic attempting dashboard access to login home
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Map middleware execution matching paths
export const config = {
  matcher: ['/dashboard/:path*'],
};
