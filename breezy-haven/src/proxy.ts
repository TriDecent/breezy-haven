import { NextRequest, NextResponse, ProxyConfig } from 'next/server';

import { Auth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';

export const config: ProxyConfig = {
  matcher: [
    '/guest/account/:path*',
    '/guest/login',
    '/guest/cabins/:path*',
    '/guest/api/auth/callback/google',
    '/guest',
    '/staff/:path*',
  ],
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
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
