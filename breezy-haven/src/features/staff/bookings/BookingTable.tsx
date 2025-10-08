'use client';

import {
  Button,
  Checkbox,
  DataTable,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Booking } from '@/shared/schemas';
import type { ColumnDef } from '@tanstack/react-table';
import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  parseISO,
} from 'date-fns';
import {
  ArrowRight,
  CopyIcon,
  DoorOpen,
  Eye,
  MoreHorizontalIcon,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StatusBadge } from './StatusBadge';
import { checkoutAction } from './[bookingId]/checkout-action';
import { deleteBookingAction } from './delete-booking-action';

export function BookingTable({ bookings }: BookingTableProps) {
  return <DataTable columns={columns} data={[...bookings]} />;
}

const cabinInfoColumn: ColumnDef<BookingTableProps['bookings'][number]> = {
  header: 'Cabin Info',
  columns: [
    {
      accessorKey: 'cabinId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Cabin ID'} />
      ),
    },
    {
      id: 'name',
      accessorFn: ({ cabin }) => cabin.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Name'} />
      ),
      cell: ({ row }) => (
        <span className='font-bold text-pretty'>{row.original.cabin.name}</span>
      ),
    },
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className='relative mx-auto aspect-video w-52 overflow-hidden rounded-md'>
          <Image
            src={row.original.cabin.image}
            alt='A cabin image'
            fill
            quality={75}
            sizes='(max-width: 768px) 100vw, 208px'
            draggable={false}
            className='object-cover object-center'
          />
        </div>
      ),
    },
  ],
} as const;

const guestInfoColumn: ColumnDef<BookingTableProps['bookings'][number]> = {
  header: 'Guest Info',
  columns: [
    {
      id: 'info',
      accessorFn: ({ guest }) => guest.email,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Guest'} />
      ),
      cell: ({ row }) => (
        <p className='flex flex-col'>
          <span className='text-xl font-semibold'>
            {row.original.guest.fullName}
          </span>
          <span className='text-muted-foreground text-sm'>
            {row.original.guest.email}
          </span>
        </p>
      ),
    },
    {
      id: 'observations',
      accessorFn: ({ observations }) => observations,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={'Observations'}
          className='text-pretty'
        />
      ),
      cell: ({ row }) => (
        <span className='text-pretty'>
          {row.original.observations.length === 0
            ? '—'
            : row.original.observations}
        </span>
      ),
    },
  ],
} as const;

const bookingInfoColumn: ColumnDef<BookingTableProps['bookings'][number]> = {
  header: 'Booking Info',
  columns: [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Booking ID'} />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Status'} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'dates',
      accessorFn: ({ startDate }) => parseISO(startDate),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Dates' />
      ),
      cell: ({ row }) => (
        <p className='flex flex-col'>
          <span className='flex items-center justify-center gap-1'>
            {isToday(row.original.startDate)
              ? 'Today'
              : `${!isPast(row.original.startDate) ? `In ${formatDistanceToNow(row.original.startDate)}` : `${formatDistanceToNow(row.original.startDate)} ago`}`}{' '}
            <ArrowRight size='1rem' /> {row.original.numNights} night{' '}
            {row.original.numNights > 1 ? 'stays' : 'stay'}
          </span>
          <span className='text-muted-foreground text-center text-xs'>
            {format(row.original.startDate, 'LLLL do yyyy')} &mdash;{' '}
            {format(row.original.endDate, 'LLLL do yyyy')}
          </span>
        </p>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Amount'} />
      ),
      cell: ({ row }) => (
        <span className={'text-lg font-semibold text-emerald-500'}>
          $
          {row.original.totalPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
  ],
} as const;

const actionColumn: ColumnDef<BookingTableProps['bookings'][number]> = {
  header: 'Actions',
  columns: [
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CopyAction booking={row.original} />
            <EditAction bookingId={row.original.id} />
            <CheckoutAction
              bookingId={row.original.id}
              isCheckedIn={row.original.status === 'checked-in'}
            />
            <DeleteAction bookingId={row.original.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
} as const;

const selectAllColumn: ColumnDef<BookingTableProps['bookings'][number]> = {
  header: 'Select all',
  columns: [
    {
      id: 'select-all',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={() => table.toggleAllRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
        />
      ),
    },
  ],
};

const columns: ColumnDef<BookingTableProps['bookings'][number]>[] = [
  selectAllColumn,
  cabinInfoColumn,
  guestInfoColumn,
  bookingInfoColumn,
  actionColumn,
];

function EditAction({
  bookingId,
}: {
  bookingId: BookingTableProps['bookings'][number]['id'];
}) {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        await new Promise(resolve => setTimeout(resolve, 300)); // give some time for DropdownMenu to cleanup aria-hidden, avoid warning accessibility
        router.push(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
      }}
    >
      <Eye /> See details
    </DropdownMenuItem>
  );
}

function CopyAction({
  booking,
}: {
  booking: BookingTableProps['bookings'][number];
}) {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await navigator.clipboard.writeText(JSON.stringify(booking));
        toast.success('Copy successfully!');
      }}
    >
      <CopyIcon /> Copy info
    </DropdownMenuItem>
  );
}

function CheckoutAction({
  bookingId,
  isCheckedIn,
}: {
  bookingId: Booking['id'];
  isCheckedIn: boolean;
}) {
  return (
    <DropdownMenuItem
      onClick={() => {
        if (!isCheckedIn) {
          toast.error('Checkout failed', {
            description: 'Guest has not checked in.',
          });
          return;
        }

        toast.promise(checkoutAction(bookingId), {
          loading: 'Checking out the guest',
          error: 'An error has occurred while trying to check out the booking',
          success: 'Check out the guest successfully!',
        });
      }}
    >
      <DoorOpen /> Checkout
    </DropdownMenuItem>
  );
}

function DeleteAction({ bookingId }: { bookingId: Booking['id'] }) {
  return (
    <DropdownMenuItem
      onClick={() =>
        toast.warning(
          `Are you sure that you want to delete the booking - ${bookingId}`,
          {
            description: 'This action cannot be undone',
            action: {
              label: 'Yes',
              onClick: () =>
                toast.promise(deleteBookingAction(bookingId), {
                  loading: 'Deleting the booking',
                  error: () => `Delete the booking ${bookingId} failed!`,
                  success: `The booking ${bookingId} has been deleted`,
                }),
            },
          }
        )
      }
    >
      <Trash2 /> Delete
    </DropdownMenuItem>
  );
}

interface CabinInfo {
  readonly name: string;
  readonly image: string;
}

interface GuestInfo {
  email: string;
  fullName: string;
}

interface BookingTableProps {
  readonly bookings: readonly (Booking & {
    readonly cabin: CabinInfo;
    readonly guest: GuestInfo;
  })[];
}
