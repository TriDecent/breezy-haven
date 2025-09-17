import { jwtManager } from '@/lib';
import { unauthStaffService } from '@/services';
import { CookieConfig } from '@/shared/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const [accessPayload, refreshPayload] = await Promise.all([
    verifyAccessTokenAsyncFromRequest(request),
    verifyRefreshTokenAsyncFromRequest(request),
  ]);

  if (accessPayload)
    return NextResponse.json({
      user: accessPayload,
      isAuthenticated: true,
    });

  if (refreshPayload) {
    const tokens = await refreshAccessTokenAsyncFromRequest(request);
    if (!tokens)
      return NextResponse.json(
        {
          isAuthenticated: false,
        },
        { status: 401 }
      );

    const response = NextResponse.json({ isAuthenticated: true });
    response.cookies.set(
      CookieConfig.keys.staff.token.access,
      tokens.accessToken
    );
    response.cookies.set(
      CookieConfig.keys.staff.token.refresh,
      tokens.refreshToken
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

async function verifyAccessTokenAsyncFromRequest(request: NextRequest) {
  const accessToken = request.cookies.get(
    CookieConfig.keys.staff.token.access
  )?.value;

  if (!accessToken) return null;
  return jwtManager.verifyAccessTokenAsync(accessToken);
}

async function verifyRefreshTokenAsyncFromRequest(request: NextRequest) {
  const refreshToken = request.cookies.get(
    CookieConfig.keys.staff.token.refresh
  )?.value;

  if (!refreshToken) return null;
  return jwtManager.verifyRefreshTokenAsync(refreshToken);
}

async function refreshAccessTokenAsyncFromRequest(request: NextRequest) {
  const accessToken = request.cookies.get(
    CookieConfig.keys.staff.token.access
  )?.value;
  const refreshToken = request.cookies.get(
    CookieConfig.keys.staff.token.refresh
  )?.value;

  if (!accessToken || !refreshToken) return null;

  const refreshPayload = await verifyRefreshTokenAsyncFromRequest(request);
  if (!refreshPayload) return null;
  const { data, errors } = await unauthStaffService.getByEmail(
    refreshPayload.userEmail
  );
  if (errors) return null;

  return await jwtManager.refreshAccessTokenAsync(
    { accessToken, refreshToken },
    data
  );
}
