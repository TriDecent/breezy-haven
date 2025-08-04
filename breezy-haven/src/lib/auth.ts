import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const Auth = NextAuth({
  providers: [Google],
  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
});
