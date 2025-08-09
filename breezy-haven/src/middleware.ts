import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { Auth } from './lib/auth';
import { METADATA } from './shared';

export const config: MiddlewareConfig = {
  matcher: ['/account/:path*', '/login'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(METADATA.login.href))
    return handleLoginRouteAsync(request);

  if (pathname.startsWith(METADATA.account.href))
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
        `${METADATA['setup-new-guest'].href}?${request.nextUrl.searchParams.toString()}`,
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
      new URL(`${METADATA.login.href}?${params}`, request.nextUrl)
    );
  }

  return NextResponse.next();
}
