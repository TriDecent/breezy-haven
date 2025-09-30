import { Auth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { redirect } from 'next/navigation';
import { ProfileForm } from './forms/ProfileForm';

export async function Profile() {
  const accessPayload = await Auth.staff.session.verifyAccessTokenAsync();

  if (!accessPayload) {
    const searchParams = new URLSearchParams({
      callbackUrl: ROUTES.staff.nested.profile.href,
    });

    redirect(`${ROUTES.login.href}/?${searchParams.toString()}`);
  }

  return <ProfileForm defaultProfile={accessPayload} />;
}
