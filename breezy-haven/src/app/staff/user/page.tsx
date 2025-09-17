import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.staff.nested.user.metadata;

export default function UserPage() {
  return <>User page</>;
}
