import { Auth } from '@/features/auth';
import { COOKIES_CONFIG } from '@/shared/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const [accessPayload, refreshPayload] = await Promise.all([
    Auth.staff.session.verifyAccessTokenAsyncFromRequest(request),
    Auth.staff.session.verifyRefreshTokenAsyncFromRequest(request),
  ]);

  if (accessPayload)
    return NextResponse.json({
      user: accessPayload,
      isAuthenticated: true,
    });

  if (refreshPayload) {
    const tokens =
      await Auth.staff.session.refreshAccessTokenAsyncFromRequest(request);

    if (!tokens)
      return NextResponse.json(
        {
          isAuthenticated: false,
        },
        { status: 401 }
      );

    const response = NextResponse.json({ isAuthenticated: true });
    response.cookies.set(
      COOKIES_CONFIG.keys.staff.token.access,
      tokens.accessToken,
      COOKIES_CONFIG.option.short
    );
    response.cookies.set(
      COOKIES_CONFIG.keys.staff.token.refresh,
      tokens.refreshToken,
      COOKIES_CONFIG.option.long
    );

    return response;
  }

  return NextResponse.json(
    {
      isAuthenticated: false,
    },
    { status: 401 }
  );
}
