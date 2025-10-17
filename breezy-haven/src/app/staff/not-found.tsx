import { NotFound } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

export default function StaffNotFound() {
  return <NotFound goBackToHref={ROUTES.staff.nested.dashboard.href} />;
}
