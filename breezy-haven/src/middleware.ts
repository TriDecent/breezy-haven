import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { Auth } from './lib';

export const config: MiddlewareConfig = {
  matcher: ['/account/:path*', '/login'],
};

export async function middleware(request: NextRequest) {
  const session = await Auth.auth();
  const { pathname } = request.nextUrl;

  if (session?.user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!session?.user && pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}
