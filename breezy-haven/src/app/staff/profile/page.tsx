import { Profile, UpdatePassword } from '@/features/staff/profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  Spinner,
} from '@/shared/components';
import { PencilLine, RotateCcwKey } from 'lucide-react';
import { Suspense } from 'react';

export default async function ProfilePage() {
  return (
    <section>
      <h1 className='text-accent-400 mb-12 text-end text-2xl tracking-widest xl:text-4xl'>
        My profile
      </h1>

      <div className='flex flex-col gap-16 lg:flex-row lg:gap-8 xl:gap-16'>
        <Card className='mx-auto max-w-xl'>
          <CardTitle className='px-6'>
            <p className='mb-2 flex items-center gap-2'>
              <PencilLine /> Edit Profile
            </p>
            <CardDescription>
              Update your personal information and preferences.
            </CardDescription>
          </CardTitle>
          <CardContent>
            <Suspense fallback={<Spinner />}>
              <Profile />
            </Suspense>
          </CardContent>
          <CardFooter className='text-muted-foreground text-sm'>
            Your profile will be updated as soon as you confirm by clicking Save
            changes
          </CardFooter>
        </Card>

        <Card className='mx-auto max-w-xl h-fit'>
          <CardTitle className='px-6'>
            <p className='mb-2 flex items-center gap-2'>
              <RotateCcwKey /> Change password
            </p>
            <CardDescription>
              Update your password below. Make sure to use a strong, unique
              password.
            </CardDescription>
          </CardTitle>

          <CardContent>
            <UpdatePassword />
          </CardContent>
          <CardFooter className='text-muted-foreground text-sm'>
            Your password will be updated as soon as you confirm by clicking
            Save changes
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
