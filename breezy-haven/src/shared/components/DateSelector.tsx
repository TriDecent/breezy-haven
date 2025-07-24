'use client';

import { Calendar } from '@/shared/components/ui/calendar';
import { ComponentProps } from 'react';

type DateSelector = ComponentProps<typeof Calendar>;

export default function DateSelector({
  description,
  ...props
}: { description: string } & DateSelector) {
  return (
    <div className='flex min-w-0 flex-col items-center gap-2'>
      <Calendar {...props} className='rounded-lg border shadow-lg' />
      <div className='text-muted-foreground text-center text-sm'>
        {description}
      </div>
    </div>
  );
}
