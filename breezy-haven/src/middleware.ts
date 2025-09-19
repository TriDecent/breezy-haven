import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { Auth } from './lib/auth';
import { ROUTES } from './shared/constants';

export const config: MiddlewareConfig = {
  matcher: [
    '/guest/account/:path*',
    '/guest/login',
    '/guest/cabins/:path*',
    '/guest/api/auth/callback/google',
    '/guest',

    '/staff',
    '/staff/dashboard',
    '/staff/bookings',
    '/staff/cabins',
    '/staff/guests',
    '/staff/settings',
  ],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/guest')) return handleGuestRouteAsync(request);

  if (pathname.startsWith(ROUTES.staff.href))
    return handleStaffRouteAsync(request);

  return NextResponse.next();
}

async function handleStaffRouteAsync(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ROUTES.staff.href)
    return NextResponse.redirect(
      new URL(ROUTES.staff.nested.dashboard.href, request.nextUrl)
    );

  return await Auth.staff.ensureStaffIsAuthenticatedFromRequestAsync(request);
}

async function handleGuestRouteAsync(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ROUTES.login.href))
    return handleLoginRouteAsync(request);

  if (pathname.startsWith(ROUTES.account.href))
    return handleAccountRouteAsync(request);

  if (pathname.startsWith(ROUTES.cabins.href))
    return handleCabinRouteAsync(request);

  if (pathname.startsWith('/guest/api/auth/callback/google'))
    return handleGoogleCallback(request);

  if (pathname === '/guest')
    return NextResponse.redirect(new URL(ROUTES.cabins.href, request.nextUrl));

  return NextResponse.next();
}

async function handleGoogleCallback(request: NextRequest) {
  const doesErrorParamExist = request.nextUrl.searchParams.has('error');
  if (!doesErrorParamExist) return NextResponse.next();

  return NextResponse.redirect(
    new URL(
      `${ROUTES.login.href}?${request.nextUrl.searchParams.toString()}`,
      request.nextUrl
    )
  );
}

async function handleLoginRouteAsync(
  request: NextRequest
): Promise<NextResponse> {
  const session = await Auth.guest.getThirdPartySessionAsync();

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
  const session = await Auth.guest.getThirdPartySessionAsync();

  if (!session) {
    const params = new URLSearchParams({
      callbackUrl: request.nextUrl.pathname,
    });
    return NextResponse.redirect(
      new URL(`${ROUTES.login.href}?${params}`, request.nextUrl)
    );
  }

  if (
    request.nextUrl.pathname ===
    ROUTES.account.nested.reservations.nested.edit.href
  )
    return NextResponse.rewrite(
      new URL(`${ROUTES.account.nested.reservations.href}`, request.nextUrl)
    );

  return NextResponse.next();
}

async function handleCabinRouteAsync(
  request: NextRequest
): Promise<NextResponse> {
  if (!/^\/cabins\/\d+$/.test(request.nextUrl.pathname))
    return NextResponse.next();

  const response = NextResponse.next();
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');
  response.headers.set('Vary', 'Accept-Encoding');

  return response;
}
