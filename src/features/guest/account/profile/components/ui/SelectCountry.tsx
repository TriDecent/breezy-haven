'use client';
import defaultFlagSrc from '@/../public/germany.webp';
import type { Country } from '@/services';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';

import Image from 'next/image';
import { useState } from 'react';

export default function SelectCountry({
  defaultNationality,
  name,
  id,
  countries,
}: {
  defaultNationality: {
    country: string | null;
    flagSrc: string | null;
  };
  name: string;
  id: string;
  countries: readonly Country[];
}) {
  const [nationality, setNationality] = useState(defaultNationality);

  return (
    <>
      <div className='flex items-center justify-between'>
        <label htmlFor='nationality'>Where are you from?</label>
        <Image
          src={nationality.flagSrc ?? defaultFlagSrc}
          referrerPolicy='no-referrer'
          alt='Country flag'
          width={128}
          height={128}
          className='h-16 w-16 rounded-full object-cover'
        />
      </div>
      <Select
        name={name}
        value={`${nationality.country}%${nationality.flagSrc}`}
        onValueChange={value => {
          const [country, flagSrc] = value.split('%');
          setNationality({ country, flagSrc });
        }}
      >
        <SelectTrigger
          id={id}
          defaultValue={`${nationality.country ?? 'Germany'}%${nationality.flagSrc ?? defaultFlagSrc}`}
          className='w-full'
        >
          <SelectValue placeholder='Select country...' />
        </SelectTrigger>
        <SelectContent align='end' className='max-w-[90vw] md:w-3/4'>
          {countries.map(country => (
            <SelectItem
              key={country.name}
              value={`${country.name}%${country.flag}`}
            >
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
