import { StaffCreationForm } from '@/features/staff/user';
import { Card, CardContent, CardHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { UserPen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.staff.nested.user.metadata;

export default async function UserPage() {
  return (
    <section>
      <h1 className='text-accent-500 mb-4 text-2xl font-semibold tracking-widest'>
        Create a new user
      </h1>

      <Card className='mx-auto max-w-5xl'>
        <CardHeader>
          <span className='flex items-center gap-2 text-lg font-medium'>
            <UserPen /> User Details
          </span>
        </CardHeader>
        <CardContent>
          <StaffCreationForm />
        </CardContent>
      </Card>
    </section>
  );
}
