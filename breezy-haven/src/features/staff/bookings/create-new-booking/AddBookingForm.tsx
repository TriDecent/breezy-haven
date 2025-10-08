'use client';

import {
  Button,
  Calendar,
  Checkbox,
  Form,
  FormRow,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SelectItem,
} from '@/shared/components';
import type { Cabin, Guest, Setting } from '@/shared/schemas';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CirclePlus } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import type { DateRange } from 'react-day-picker';
import {
  AddBookingFormContext,
  useAddBookingForm,
} from './AddBookingFormContext';
import {
  addBookingAction,
  type AddBookingResponse,
} from './add-booking-action';
import { getBookedDatesByCabinIdAction } from './get-booked-dates-by-cabin-id-action';

export type AddBookingFormProps = Readonly<{
  guests: Guest[];
  cabins: Cabin[];
  setting: Setting;
}>;

export function AddBookingForm({
  guests,
  cabins,
  setting,
}: AddBookingFormProps) {
  const renderFields = useCallback(
    (state: AddBookingResponse, isPending: boolean) => (
      <AddBookingFormContext
        value={{ guests, cabins, setting, state, isPending }}
      >
        <Selects />

        <FormRow
          kind='textarea'
          id='observations'
          name='observations'
          labelText='Observations'
          labelClassname='min-w-24'
          placeholder='Any special requests, allergies, or notes...'
          disabled={isPending}
        />

        <Checkboxes />
      </AddBookingFormContext>
    ),
    [guests, cabins, setting]
  );

  const renderUnexpectedErrors = useCallback(
    (state: AddBookingResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-center text-red-500'>
          {state.payload.errors.unexpected}
        </p>
      ) : null,
    []
  );

  const onFormSuccess = useCallback(() => {}, []);

  const onFormErrors = useCallback(() => {}, []);

  return (
    <Form
      action={addBookingAction}
      initialState={{
        type: 'initial',
        payload: { userEntered: null, errors: null },
      }}
      renderFields={renderFields}
      renderUnexpectedErrors={renderUnexpectedErrors}
      onFormSuccess={onFormSuccess}
      onFormError={onFormErrors}
      submitNode={
        <>
          <CirclePlus /> Add Booking
        </>
      }
    />
  );
}

function Checkboxes() {
  const { isPending } = useAddBookingForm();

  return (
    <div className='flex flex-col gap-6 md:flex-row md:justify-end'>
      <div className='flex items-center space-x-3'>
        <Checkbox id='hasBreakfast' name='hasBreakfast' disabled={isPending} />
        <Label htmlFor='hasBreakfast' className='text-sm font-medium'>
          Include breakfast
        </Label>
      </div>

      <div className='flex items-center space-x-3'>
        <Checkbox id='isPaid' name='isPaid' disabled={isPending} />
        <Label htmlFor='isPaid' className='text-sm font-medium'>
          Mark as paid
        </Label>
      </div>
    </div>
  );
}

function Selects() {
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [bookedDates, setBookedDates] = useState<readonly Date[]>([]);

  const [isPending, startTransition] = useTransition();
  const handleSelectCabin = useCallback(async (cabin: Cabin) => {
    setSelectedCabin(cabin);
    setBookedDates([]);
    startTransition(async () => {
      const dates = await getBookedDatesByCabinIdAction(cabin.id);
      startTransition(() => setBookedDates(dates));
    });
  }, []);

  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
      <GuestSelect />

      <CabinSelect onSelectCabin={handleSelectCabin} />

      <GuestCountSelect selectedCabin={selectedCabin} />

      <BookingStatusSelect />

      <DateSelect
        alreadyBookedDates={bookedDates}
        isPending={isPending}
        hasSelectedCabin={!!selectedCabin}
      />
    </div>
  );
}

function GuestSelect({}) {
  const { isPending, guests } = useAddBookingForm();

  const renderSelectItems = useMemo(
    () => (
      <>
        {guests.map(guest => (
          <SelectItem key={guest.id} value={guest.id.toString()}>
            {guest.fullName} ({guest.email})
          </SelectItem>
        ))}
      </>
    ),
    [guests]
  );

  return (
    <FormRow
      kind='select'
      id='guestId'
      name='guestId'
      labelText='Guest'
      placeholder={'Select a Guest'}
      disabled={isPending}
      renderSelectItems={renderSelectItems}
    />
  );
}

function CabinSelect({
  onSelectCabin,
}: {
  onSelectCabin: (cabin: Cabin) => void;
}) {
  const { isPending, cabins } = useAddBookingForm();

  const renderSelectItems = useMemo(
    () => (
      <>
        {cabins.map(cabin => (
          <SelectItem
            key={cabin.id}
            value={cabin.id.toString()}
            onClick={() => onSelectCabin(cabin)}
          >
            {cabin.name} (Max {cabin.maxCapacity} guests)
          </SelectItem>
        ))}
      </>
    ),
    [cabins, onSelectCabin]
  );

  return (
    <FormRow
      kind='select'
      id='cabinId'
      name='cabinId'
      labelText='Cabin'
      placeholder={'Select a Cabin'}
      disabled={isPending}
      renderSelectItems={renderSelectItems}
    />
  );
}

function GuestCountSelect({ selectedCabin }: { selectedCabin: Cabin | null }) {
  const { isPending } = useAddBookingForm();

  const renderSelectItems = useMemo(
    () => (
      <>
        {selectedCabin
          ? Array.from(
              { length: selectedCabin.maxCapacity },
              (_, i) => i + 1
            ).map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'guest' : 'guests'}
              </SelectItem>
            ))
          : null}
      </>
    ),
    [selectedCabin]
  );

  return (
    <FormRow
      kind='select'
      id='numGuests'
      name='numGuests'
      labelText='Number of Guest'
      placeholder={
        selectedCabin ? 'Select number of guests' : 'Select a cabin first'
      }
      disabled={isPending || !!!selectedCabin}
      renderSelectItems={renderSelectItems}
    />
  );
}

function BookingStatusSelect() {
  const { isPending } = useAddBookingForm();

  const renderSelectItems = useMemo(
    () => (
      <>
        <SelectItem value='unconfirmed'>Unconfirmed</SelectItem>
        <SelectItem value='checked-in'>Checked In</SelectItem>
        <SelectItem value='checked-out'>Checked Out</SelectItem>
      </>
    ),
    []
  );

  return (
    <FormRow
      kind='select'
      id='status'
      name='status'
      labelText='Booking Status'
      placeholder={'Booking status'}
      disabled={isPending}
      renderSelectItems={renderSelectItems}
    />
  );
}

function DateSelect({
  hasSelectedCabin,
  alreadyBookedDates,
  isPending,
}: {
  hasSelectedCabin: boolean;
  alreadyBookedDates: readonly Date[];
  isPending: boolean;
}) {
  const { setting } = useAddBookingForm();

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const buttonText = useMemo(() => {
    if (!hasSelectedCabin) return 'Select a cabin first';
    if (isPending) return 'Loading available dates...';
    if (range?.from && range?.to) {
      return `${format(range.from, 'LLL dd, y')} — ${format(
        range.to,
        'LLL dd, y'
      )}`;
    }
    return 'Select staying dates';
  }, [hasSelectedCabin, isPending, range?.from, range?.to]);

  useEffect(() => {
    if (!isPending) return;
    setRange(undefined);
  }, [isPending]);

  return (
    <div className='space-y-2'>
      <Label>Staying Dates</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            disabled={isPending || !hasSelectedCabin}
            className='text-muted-foreground w-full justify-between text-xs'
          >
            {buttonText}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' align='start'>
          <Calendar
            mode='range'
            selected={range}
            disabled={[{ before: new Date() }, ...alreadyBookedDates]}
            min={setting.minBookingLength}
            max={setting.maxBookingLength}
            onSelect={setRange}
            required
            className='mx-auto'
          />
          <p className='text-muted-foreground p-2 text-center text-xs'>
            Staying days must be between {setting.minBookingLength} and{' '}
            {setting.maxBookingLength} days
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
