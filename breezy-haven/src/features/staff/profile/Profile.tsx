import { Auth } from '@/lib';
import { ProfileForm } from './forms/ProfileForm';

export async function Profile() {
  const accessPayload = await Auth.staff.session.verifyAccessTokenAsync();

  if (!accessPayload)
    throw new Error('You are not authorized to visit this page.');

  return <ProfileForm defaultProfile={accessPayload} />;
}
