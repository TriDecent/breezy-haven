import { ROUTES } from '@/shared';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.staff.nested.bookings.metadata;

export default function BookingsPage() {
  return <>Booking page</>;
}
