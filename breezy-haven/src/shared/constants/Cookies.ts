export const CookieConfig = {
  keys: {
    staff: {
      token: {
        access: 'staff-access-token',
        refresh: 'staff-refresh-token',
      },
    },
  },
  option: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/staff',
  },
} as const;
