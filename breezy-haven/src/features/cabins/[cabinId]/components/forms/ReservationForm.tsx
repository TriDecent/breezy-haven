'use client';

import {
  Badge,
  MiniSpinner,
  PrimaryButton,
  ROUTES,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useGetAuthQuery,
  type Cabin,
  type RootState,
} from '@/shared';
import Form from 'next/form';
import Link from 'next/link';

import { useActionState, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { addBookingAction, AddBookingResponse } from './addBookingAction';

export default function ReservationForm({ cabin }: { cabin: Cabin }) {
  const [formState, formAction, isPending] = useActionState<
    AddBookingResponse,
    FormData
  >(addBookingAction, {
    userEntered: null,
    errors: null,
  });
  const dateRange = useSelector((state: RootState) => state.ui.isoDateRange);

  useEffect(() => {
    if (formState.errors) toast.error('Added booking failed!');
  }, [formState.errors]);

  useEffect(() => {
    if (formState.isSuccess) toast.success('Added booking successfully!');
  }, [formState.isSuccess]);

  return (
    <article className='h-fit shadow-lg lg:order-2'>
      <Status />
      <Form
        action={formAction}
        className='bg-primary-900 flex flex-col gap-5 rounded-b-lg px-4 py-5 text-lg sm:px-8 md:py-10 xl:px-16'
      >
        <input type='hidden' name='cabinId' value={cabin.id} />
        <input type='hidden' name='startDate' value={dateRange?.from ?? ''} />
        <input type='hidden' name='endDate' value={dateRange?.to ?? ''} />

        <div>
          <GuestCountSelect
            maxCapacity={cabin.maxCapacity}
            key={formState.isSuccess ? '1' : '2'}
          />
          {formState.errors?.guestCount ? (
            <p className='text-red-500'>{formState.errors.guestCount}</p>
          ) : null}
        </div>

        <div>
          <ObservationsInput
            defaultObservations={formState.userEntered?.observations}
          />
          {formState.errors?.observations ? (
            <p className='text-red-500'>{formState.errors.observations}</p>
          ) : null}
        </div>

        <div>
          <ActionConfirm isProcessing={isPending} />
          {formState.errors?.unexpected ? (
            <p className='text-center text-red-500'>
              {formState.errors.unexpected}
            </p>
          ) : null}
          {formState.errors?.startDate || formState.errors?.endDate ? (
            <p className='text-center text-red-500'>
              {formState.errors.startDate ?? formState.errors.endDate}
            </p>
          ) : null}
        </div>
      </Form>
    </article>
  );
}

function GuestCountSelect({ maxCapacity }: { maxCapacity: number }) {
  const [guestCount, setGuestCount] = useState<number>(0);

  return (
    <div className='space-y-2'>
      <label htmlFor='guestCount'>How many guests?</label>
      <Select
        name='guestCount'
        value={`${guestCount === 0 ? '' : guestCount}`}
        onValueChange={value => setGuestCount(Number(value))}
      >
        <SelectTrigger id='guestCount' className='w-full'>
          <SelectValue placeholder='Select number of guests' />
        </SelectTrigger>
        <SelectContent align='start'>
          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
            <SelectItem key={x} value={`${x}`}>
              {x} {x === 1 ? 'guest' : 'guests'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ActionConfirm({ isProcessing }: { isProcessing: boolean }) {
  const { data } = useGetAuthQuery();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-end'>
      <div className='w-full lg:order-2'>
        {data?.isAuthenticated || !isMounted ? (
          <PrimaryButton>
            {!isProcessing ? 'Reserve now' : <MiniSpinner />}
          </PrimaryButton>
        ) : (
          <Link
            href={`${ROUTES.login.href}`}
            className='flex w-full justify-center'
          >
            <p>
              <span className='text-accent-500 underline'>Sign in</span> to
              reserve the cabin
            </p>
          </Link>
        )}
      </div>
      <p className='text-muted-foreground self-center text-base lg:order-1'>
        Start by selecting dates
      </p>
    </div>
  );
}

function ObservationsInput({
  defaultObservations,
}: {
  defaultObservations?: string;
}) {
  return (
    <div className='space-y-2'>
      <label htmlFor='observations'>
        Anything we should know about your stay?
      </label>
      <Textarea
        name='observations'
        id='observations'
        defaultValue={defaultObservations}
        placeholder='Any pets, allergies, special requirements, etc.?'
      />
    </div>
  );
}

function Status() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { data, isFetching } = useGetAuthQuery();
  useEffect(() => setIsMounted(true), []);

  return (
    <div className='bg-primary-800 text-primary-300 flex items-center justify-between rounded-t-lg px-8 py-4 lg:px-16'>
      {isFetching || !isMounted ? (
        <div className='h-8 w-8 animate-pulse rounded-full bg-gray-300' />
      ) : data ? (
        <>
          <p>Logged in as</p>
          <Badge avatarSrc={data.user?.image} name={data.user?.name} />
        </>
      ) : (
        <p>You haven&apos;t logged in yet</p>
      )}
    </div>
  );
}
