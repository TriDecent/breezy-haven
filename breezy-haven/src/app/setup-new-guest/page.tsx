import { Auth } from '@/lib';
import { guestSetupService } from '@/services';
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
        <SetupGuest callbackUrl={params.callbackUrl ?? METADATA.account.href} />
      </Suspense>
    </section>
  );
}

// * This user creation logic works correctly only because we're relying solely on the email from Google's cookie.
// * We can safely assume that our database contains only users authenticated via Google.
// * However, if we introduce other login methods in the future, this approach will no longer be reliable.
// * In such cases, we must check whether the user already exists before attempting to create one.
// * Additionally, if any error occurs during this process, the app will redirect to the login page.
// * Since a third-party session (e.g. Google) still exists, the login will immediately redirect back to this route,
// * potentially causing a loop or repeated errors.

// * Solution: Create a dedicated `setup-error` route to handle this edge case gracefully.

async function SetupGuest({ callbackUrl }: { callbackUrl: string }) {
  const session = await Auth.getFullSessionAsync();
  if (!session.thirdParty?.user) redirect(METADATA.login.href);
  if (session.main) redirect(callbackUrl);

  const user = session.thirdParty.user;

  if (!user.email || !user.name) redirect(METADATA.login.href);

  const { email, name } = user;

  const { error } = await guestSetupService.create({ email, fullName: name });

  if (error) redirect(METADATA.login.href);

  redirect(callbackUrl);

  return null;
}
