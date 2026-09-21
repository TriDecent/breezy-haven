import { createContext, use } from 'react';
import type { AddBookingFormProps } from './AddBookingForm';
import type { AddBookingResponse } from './add-booking-action';

export const AddBookingFormContext = createContext<
  | (AddBookingFormProps &
      Readonly<{ state: AddBookingResponse; isPending: boolean }>)
  | null
>(null);

export function useAddBookingForm() {
  const context = use(AddBookingFormContext);
  if (!context) {
    throw new Error(
      'useAddBookingForm must be used within an AddBookingFormContext'
    );
  }

  return context;
}
