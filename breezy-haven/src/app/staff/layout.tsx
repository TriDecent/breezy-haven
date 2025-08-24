import { PageLayout } from '@/shared';
import type { ReactNode } from 'react';

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <PageLayout>
      <PageLayout.Header></PageLayout.Header>
      <PageLayout.Main>{children}</PageLayout.Main>
      <PageLayout.Footer />
    </PageLayout>
  );
}
