'use client';
import { cn } from '@/shared/utils';
import { Check, Download } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function DownloadButton({
  text,
  link,
  className,
}: {
  text: string;
  link: string;
  className?: string;
}) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    if (!isButtonClicked) return;

    const timeoutId = setTimeout(() => setIsButtonClicked(false), 5000);

    return () => clearTimeout(timeoutId);
  }, [isButtonClicked]);

  return (
    <Button
      variant='secondary'
      onClick={() => setIsButtonClicked(true)}
      disabled={isButtonClicked}
      className={cn('shadow', className)}
      asChild
    >
      <Link href={link}>
        {isButtonClicked ? (
          <>
            Downloaded <Check />
          </>
        ) : (
          <>
            <Download />
            {text}
          </>
        )}
      </Link>
    </Button>
  );
}
