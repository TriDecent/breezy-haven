import { Auth } from '@/features/auth';
import { NextResponse } from 'next/server';

class AuthError {
  constructor(public readonly message: string) {}
}

export async function GET() {
  try {
    const { main, thirdParty } = await Auth.guest.getFullSessionAsync();
    if (!main) throw new AuthError('You are not authenticated');

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        name: main.fullName,
        email: main.email,
        image: thirdParty?.user?.image,
      },
    });
  } catch (e: unknown) {
    if (e instanceof AuthError) {
      return NextResponse.json(
        { isAuthenticated: false, message: e.message },
        { status: 401 }
      );
    }

    console.log(e);

    return NextResponse.json(
      { isAuthenticated: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
