import {
  getFullSessionAsync,
  getThirdPartySessionAsync,
  nextAuth,
  verifySession,
} from './guestAuth';
import {
  createTokensAsync,
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
    createTokensAsync,

    verifyAccessTokenAsync,
    verifyRefreshTokenAsync,
    refreshAccessTokenAsync,

    verifyAccessTokenAsyncFromRequest,
    verifyRefreshTokenAsyncFromRequest,
    refreshAccessTokenAsyncFromRequest,
  },
} as const;
