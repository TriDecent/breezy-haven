import { Settings } from '@/features/staff/settings';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from '@/shared';
import { Suspense } from 'react';

export default function SettingsPage() {
  return (
    <>
      <h1 className='text-accent-500 mb-4 text-2xl font-semibold tracking-widest'>
        Settings
      </h1>

      <Card className='mx-auto w-fit min-w-2xs'>
        <CardHeader>
          <CardTitle>Update Settings</CardTitle>
          <CardDescription>
            Update The Breezy Haven preferences below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Spinner />}>
            <Settings />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
