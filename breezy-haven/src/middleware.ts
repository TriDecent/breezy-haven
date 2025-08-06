import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { Auth } from './lib/auth';

export const config: MiddlewareConfig = {
  matcher: ['/account/:path*', '/login'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login')) return handleLoginRouteAsync(request);

  if (pathname.startsWith('/account')) return handleAccountRouteAsync(request);

  return NextResponse.next();
}

async function handleLoginRouteAsync(
  request: NextRequest
): Promise<NextResponse> {
  const session = await Auth.getFullSessionAsync();

  if (session.main) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (session.thirdParty) {
    console.log(request.nextUrl.searchParams.toString());
    return NextResponse.redirect(
      new URL(
        `/setup-new-guest?${request.nextUrl.searchParams.toString()}`,
        request.nextUrl
      )
    );
  }

  return NextResponse.next();
}

async function handleAccountRouteAsync(
  request: NextRequest
): Promise<NextResponse> {
  const session = await Auth.getFullSessionAsync();

  if (!session.thirdParty || !session.main) {
    const params = new URLSearchParams({
      callbackUrl: request.nextUrl.pathname,
    });
    return NextResponse.redirect(new URL(`/login?${params}`, request.nextUrl));
  }

  return NextResponse.next();
}
