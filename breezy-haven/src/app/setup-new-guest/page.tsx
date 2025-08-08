import { Auth } from '@/lib';
import { guestService } from '@/services';
import { METADATA, Spinner } from '@/shared';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = METADATA['setup-new-guest'].metadata;

export default async function SettingUpGuestPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <section>
      <h1 className='text-center text-2xl font-medium'>
        Signing in, please don&apos;t close the page
      </h1>
      <Suspense fallback={<Spinner />}>
        <SetupGuest callbackUrl={params.callbackUrl ?? '/account'} />
      </Suspense>
    </section>
  );
}

async function SetupGuest({ callbackUrl }: { callbackUrl: string }) {
  const session = await Auth.getFullSessionAsync();
  if (session.main) redirect(callbackUrl);
  if (!session.thirdParty?.user) redirect('/login');

  const user = session.thirdParty.user;

  if (!user.email || !user.name) redirect('/login');

  const { email, name } = user;

  try {
    await guestService.create({ email, fullName: name });
  } catch {
    redirect('/login');
  }

  redirect(callbackUrl);

  return null;
}
