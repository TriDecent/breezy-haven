import type { Booking } from '@/shared';
import { createContext } from 'react';

export const BookingContext = createContext<
  BookingDetailsProps['booking'] | null
>(null);

export type BookingDetailsProps = {
  readonly booking: Booking & {
    readonly cabin: Readonly<{
      image: string;
      id: number;
      name: string;
    }>;
    readonly guest: Readonly<{
      email: string;
      fullName: string;
      countryFlag: string;
      nationalID: string;
    }>;
    readonly setting: Readonly<{ breakfastPrice: number }>;
  };
};
