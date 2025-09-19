import {
  getFullSessionAsync,
  getThirdPartySessionAsync,
  nextAuth,
  verifySession,
} from './guestAuth';
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
} from './staffAuth';

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
