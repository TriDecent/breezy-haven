import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { Auth } from './lib/auth';
import { ROUTES } from './shared';

export const config: MiddlewareConfig = {
  matcher: ['/account/:path*', '/login'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ROUTES.login.href))
    return handleLoginRouteAsync(request);

  if (pathname.startsWith(ROUTES.account.href))
    return handleAccountRouteAsync(request);

  return NextResponse.next();
}

async function handleLoginRouteAsync(
  request: NextRequest
): Promise<NextResponse> {
  const session = await Auth.getThirdPartySessionAsync();

  if (session) {
    return NextResponse.redirect(
      new URL(
        `${ROUTES['setup-new-guest'].href}?${request.nextUrl.searchParams.toString()}`,
        request.nextUrl
      )
    );
  }

  return NextResponse.next();
}

async function handleAccountRouteAsync(
  request: NextRequest
): Promise<NextResponse> {
  const session = await Auth.getThirdPartySessionAsync();

  if (!session) {
    const params = new URLSearchParams({
      callbackUrl: request.nextUrl.pathname,
    });
    return NextResponse.redirect(
      new URL(`${ROUTES.login.href}?${params}`, request.nextUrl)
    );
  }

  return NextResponse.next();
}
