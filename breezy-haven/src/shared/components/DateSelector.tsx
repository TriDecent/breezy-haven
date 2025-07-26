'use client';

import { Calendar } from '@/shared/components/ui/calendar';
import { ComponentProps, useState } from 'react';
import { enUS, vi } from 'react-day-picker/locale';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type DateSelector = ComponentProps<typeof Calendar>;

const locales = {
  en: enUS,
  vi: vi,
} as const;
type CustomLocale = keyof typeof locales;

export default function DateSelector({
  description,
  ...props
}: { description: string } & DateSelector) {
  const [locale, setLocale] = useState<CustomLocale | undefined>(undefined);

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle>Pick your dates</CardTitle>
        <CardDescription>
          Click to select start and end of your stay
        </CardDescription>
        <CardAction>
          <Select
            value={locale}
            onValueChange={value => setLocale(value as CustomLocale)}
          >
            <SelectTrigger className='w-[118px]'>
              <SelectValue placeholder='Language' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectSeparator />
                <SelectItem value='en'>English</SelectItem>
                <SelectItem value='vi'>Vietnamese</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Calendar
          {...props}
          locale={locales[locale ?? 'en']}
          className='w-full'
        />
      </CardContent>
      <CardFooter className='text-muted-foreground justify-center text-sm'>
        {description}
      </CardFooter>
    </Card>
  );
}

