import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Bird, LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function NotFound({
  goBackToHref = ROUTES.home.href,
}: {
  goBackToHref?: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Bird />
        </EmptyMedia>
        <EmptyTitle>Page Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Return to the
          homepage.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          href={goBackToHref}
          replace
          className='text-accent-500 animate-pulse underline hover:cursor-pointer'
        >
          <LinkIcon />
        </Link>
      </EmptyContent>
    </Empty>
  );
}
