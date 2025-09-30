'use client';

import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/shared/components';

import { RefreshCcwDot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

const intervalSchema = z.coerce
  .number()
  .refine(num => [30, 45, 60].includes(num), {
    message: 'Invalid interval',
  });

const refreshIntervals = [30, 45, 60];
type RefreshIntervals = (typeof refreshIntervals)[number];

export function DataRefresh() {
  const router = useRouter();
  const [interval, setRefreshInterval] = useState<RefreshIntervals>(60);
  const [shouldAutoRefresh, setShouldAutoRefresh] = useState(false);
  const handleManualRefresh = useCallback(() => router.refresh(), [router]);
  const handleAutoRefresh = useCallback(
    (intervalValue: string) => {
      if (!shouldAutoRefresh) return;
      const parsed = intervalSchema.safeParse(intervalValue);
      if (!parsed.success) return;
      setRefreshInterval(parsed.data as RefreshIntervals);
    },
    [shouldAutoRefresh]
  );

  useEffect(() => {
    if (!shouldAutoRefresh) return;
    const intervalId = setInterval(() => router.refresh(), interval * 1000);

    return () => clearInterval(intervalId);
  }, [interval, router, shouldAutoRefresh]);

  return (
    <div className='flex justify-between'>
      <div className='flex flex-col space-y-6 sm:space-x-6 sm:flex-row sm:space-y-0'>
        <Button
          variant={'outline'}
          className='w-32'
          onClick={handleManualRefresh}
        >
          <RefreshCcwDot /> Refresh
        </Button>
        {shouldAutoRefresh ? (
          <Select
            defaultValue='60'
            name='refresh-intervals'
            onValueChange={handleAutoRefresh}
          >
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Refresh Interval</SelectLabel>
                {refreshIntervals.map(interval => (
                  <SelectItem key={interval} value={interval.toString()}>
                    {interval} seconds
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div className='flex h-fit translate-y-2 items-center gap-2'>
        <Switch
          id='auto-refresh-switch'
          onCheckedChange={() => setShouldAutoRefresh(state => !state)}
        />
        <Label htmlFor='auto-refresh-switch'>Auto refresh</Label>
      </div>
    </div>
  );
}
