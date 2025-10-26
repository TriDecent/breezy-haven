import { NotFound } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

export default function GuestAccountNotFound() {
  return <NotFound goBackToHref={ROUTES.cabins.href} />;
}
