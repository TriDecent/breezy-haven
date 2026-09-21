import { AddNewBooking } from '@/features/staff/bookings/create-new-booking';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Pencil } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata =
  ROUTES.staff.nested.bookings.nested['create-new-booking'].metadata;

export default function CreateNewBookingPage() {
  return (
    <section className='space-y-6'>
      <h1 className='text-accent-500 text-2xl font-semibold tracking-widest'>
        Add a new booking
      </h1>

      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Pencil size={20} /> Add New Booking
          </CardTitle>
          <CardDescription>
            Create a new booking for a guest by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Spinner />}>
            <AddNewBooking />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
}
