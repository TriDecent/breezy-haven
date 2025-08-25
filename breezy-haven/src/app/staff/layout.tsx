import { PageLayout, ROUTES } from '@/shared';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = ROUTES.staff.metadata;

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <PageLayout>
      <PageLayout.Header></PageLayout.Header>
      <PageLayout.Main>{children}</PageLayout.Main>
      <PageLayout.Footer />
    </PageLayout>
  );
}
