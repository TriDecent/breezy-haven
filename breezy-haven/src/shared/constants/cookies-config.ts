const isDev = process.env.NODE_ENV === 'development';

const sevenDays = 60 * 60 * 7 * 24;
const oneHour = 60 * 60;

export const COOKIES_CONFIG = {
  keys: {
    staff: {
      token: {
        access: 'staff-access-token',
        refresh: 'staff-refresh-token',
      },
    },
  },
  option: {
    short: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: isDev ? sevenDays : oneHour,
      path: '/',
    },
    long: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: isDev ? sevenDays : sevenDays,
      path: '/',
    },
  },
} as const;
