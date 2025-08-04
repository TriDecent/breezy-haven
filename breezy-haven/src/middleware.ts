import { MiddlewareConfig } from 'next/server';
import { Auth } from './lib';

export const config: MiddlewareConfig = {
  matcher: ['/account/:path*'],
};

export const middleware = Auth.auth;
