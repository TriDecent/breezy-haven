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
import { ROUTES } from '@/shared/constants';
import type { Cabin, Guest, Setting } from '@/shared/schemas';
import { dateHelper } from '@/shared/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CirclePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
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
  state: AddBookingResponse;
  guests: Guest[];
  cabins: Cabin[];
  setting: Setting;
}>;

export function AddBookingForm({
  guests,
  cabins,
  setting,
}: AddBookingFormProps) {
  const toasterIdRef = useRef<string | number | null>(null);
  const router = useRouter();

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
          defaultValue={state.payload.userEntered?.observations}
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

  const onFormSuccess = useCallback(
    (state: AddBookingResponse) => {
      if (!toasterIdRef.current) return;
      toast.success('Add booking successfully');
      toast.dismiss(toasterIdRef.current);
      toasterIdRef.current = null;

      if (state.type !== 'success') return;
      router.push(
        `${ROUTES.staff.nested.bookings.href}/${state.payload.createdBookingId}`
      );
    },
    [router]
  );

  const onFormErrors = useCallback(() => {
    if (!toasterIdRef.current) return;
    toast.error('An error has occurred!');
    toast.dismiss(toasterIdRef.current);
    toasterIdRef.current = null;
  }, []);

  const onFormPending = useCallback(() => {
    toasterIdRef.current = toast.loading('Adding booking...');
  }, []);

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
      onFormPending={onFormPending}
      submitNode={
        <>
          <CirclePlus /> Add Booking
        </>
      }
    />
  );
}

function Checkboxes() {
  const { isPending, state } = useAddBookingForm();
  const [hasBreakFast, setHasBreakFast] = useState<boolean>(
    state.payload.userEntered?.hasBreakfast ?? false
  );

  return (
    <div className='flex items-center space-x-3 self-end'>
      <input type='hidden' name='hasBreakFast' value={`${hasBreakFast}`} />
      <Checkbox
        id='breakfast'
        name='breakfast'
        disabled={isPending}
        defaultChecked={hasBreakFast}
        onCheckedChange={() => setHasBreakFast(state => !state)}
      />
      <Label htmlFor='breakfast' className='text-sm font-medium'>
        Include breakfast
      </Label>
      {state.payload.errors?.hasBreakfast ? (
        <p className='text-red-500'>{state.payload.errors.hasBreakfast}</p>
      ) : null}
    </div>
  );
}

function Selects() {
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [bookedDates, setBookedDates] = useState<readonly Date[]>([]);

  const [isPending, startTransition] = useTransition();
  const handleSelectCabin = useCallback(async (cabin: Cabin) => {
    setSelectedCabin(cabin);
    startTransition(async () => {
      const dates = await getBookedDatesByCabinIdAction(cabin.id);
      startTransition(() => setBookedDates(dates));
    });
  }, []);

  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
      <GuestSelect />

      <CabinSelect onCabinSelect={handleSelectCabin} />

      <GuestCountSelect selectedCabin={selectedCabin} />

      <DateSelect
        alreadyBookedDates={bookedDates}
        isPending={isPending}
        hasSelectedCabin={!!selectedCabin}
      />
    </div>
  );
}

function GuestSelect({}) {
  const { isPending, guests, state } = useAddBookingForm();

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
      error={state.payload.errors?.guestId?.at(0)}
      renderSelectItems={renderSelectItems}
    />
  );
}

function CabinSelect({
  onCabinSelect,
}: {
  onCabinSelect: (cabin: Cabin) => void;
}) {
  const { isPending, cabins, state } = useAddBookingForm();

  const handleValueChange = useCallback(
    (value: string) => {
      const selectedCabin = cabins.find(cabin => cabin.id.toString() === value);
      if (!selectedCabin) return;
      onCabinSelect(selectedCabin);
    },
    [cabins, onCabinSelect]
  );

  const renderSelectItems = useMemo(
    () => (
      <>
        {cabins.map(cabin => (
          <SelectItem key={cabin.id} value={cabin.id.toString()}>
            {cabin.name} (Max {cabin.maxCapacity} guests)
          </SelectItem>
        ))}
      </>
    ),
    [cabins]
  );

  return (
    <FormRow
      kind='select'
      id='cabinId'
      name='cabinId'
      labelText='Cabin'
      placeholder={'Select a Cabin'}
      disabled={isPending}
      error={state.payload.errors?.cabinId?.at(0)}
      onValueChange={handleValueChange}
      renderSelectItems={renderSelectItems}
    />
  );
}

function GuestCountSelect({ selectedCabin }: { selectedCabin: Cabin | null }) {
  const { isPending, state } = useAddBookingForm();

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
      error={state.payload.errors?.numGuests?.at(0)}
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
  const { setting, state } = useAddBookingForm();

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
      {/* Not sure why it must be converted into ISO date; otherwise the date gets mismatched */}
      <input
        type='hidden'
        name='startDate'
        value={dateHelper.toISODateOnly(range?.from)}
      />
      <input
        type='hidden'
        name='endDate'
        value={dateHelper.toISODateOnly(range?.to)}
      />
      <Label htmlFor='staying-dates'>Staying Dates</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='staying-dates'
            variant={'outline'}
            disabled={isPending || !hasSelectedCabin}
            className={`text-muted-foreground w-full justify-between text-xs transition-all ${state.payload.errors?.startDate || state.payload.errors?.endDate ? 'error ring ring-red-600/75' : ''}`}
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
      {state.payload.errors?.startDate || state.payload.errors?.endDate ? (
        <p className='flex-1 text-red-500 first-letter:capitalize'>
          {state.payload.errors?.startDate ?? state.payload.errors?.endDate}
        </p>
      ) : null}
    </div>
  );
}
