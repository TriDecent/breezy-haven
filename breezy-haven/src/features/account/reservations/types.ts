export interface Booking {
  readonly id: string;
  readonly guestId: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly numNights: string;
  readonly totalPrice: number;
  readonly numGuests: number;
  readonly status: 'unconfirmed' | 'paid';
  readonly created_at: string;
  readonly cabin: { readonly name: string; readonly image: string };
}
