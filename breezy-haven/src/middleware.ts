import { User } from 'next-auth';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { Auth } from './lib';
import { guestService } from './services';

export const config: MiddlewareConfig = {
  matcher: ['/account/:path*', '/login'],
};

export async function middleware(request: NextRequest) {
  const session = await Auth.auth();
  const { pathname } = request.nextUrl;

  if (pathname === '/login') {
    return handleLoginRouteAsync(request, session?.user);
  }
  if (pathname.startsWith('/account')) {
    return handleAccountRouteAsync(request, session?.user);
  }
  return NextResponse.next();
}

async function handleLoginRouteAsync(
  request: NextRequest,
  user?: User
): Promise<NextResponse> {
  const guests = await guestService.getAll();
  const doesRequestEmailExist = guests.data.some(
    guest => guest.email === user?.email
  );

  if (doesRequestEmailExist && user)
    return NextResponse.redirect(new URL('/', request.nextUrl));

  if (user) {
    const { email, name } = user;
    await guestService.create({ email, fullName: name });

    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

async function handleAccountRouteAsync(
  request: NextRequest,
  user?: User
): Promise<NextResponse> {
  if (!user) {
    const callbackUrlParam = new URLSearchParams({
      callbackUrl: request.nextUrl.pathname,
    });

    return NextResponse.redirect(
      new URL(`/login?${callbackUrlParam.toString()}`, request.nextUrl)
    );
  }

  return NextResponse.next();
}
