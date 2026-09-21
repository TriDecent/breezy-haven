import {
  getFullSessionAsync,
  getThirdPartySessionAsync,
  nextAuth,
  verifySession,
} from './guest-auth';
import {
  createTokensAsync,
  ensureStaffIsAuthenticatedAsync,
  ensureStaffIsAuthenticatedFromRequestAsync,
  refreshAccessTokenAsync,
  refreshAccessTokenAsyncFromRequest,
  verifyAccessTokenAsync,
  verifyAccessTokenAsyncFromRequest,
  verifyRefreshTokenAsync,
  verifyRefreshTokenAsyncFromRequest,
} from './staff-auth';

export const Auth = {
  guest: {
    nextAuth,
    getThirdPartySessionAsync,
    getFullSessionAsync,
    verifySession,
  },
  staff: {
    ensureStaffIsAuthenticatedFromRequestAsync,
    ensureStaffIsAuthenticatedAsync,

    session: {
      createTokensAsync,

      verifyAccessTokenAsync,
      verifyAccessTokenAsyncFromRequest,

      verifyRefreshTokenAsync,
      verifyRefreshTokenAsyncFromRequest,

      refreshAccessTokenAsync,
      refreshAccessTokenAsyncFromRequest,
    },
  },
} as const;
