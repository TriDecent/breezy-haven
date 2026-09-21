import { NotFound } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

export default function GuestNotFound() {
  return <NotFound goBackToHref={ROUTES.account.href} />;
}
