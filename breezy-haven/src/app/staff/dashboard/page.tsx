import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.staff.nested.dashboard.metadata;

export default async function DashboardPage() {
  return <div>Dashboard page</div>;
}
