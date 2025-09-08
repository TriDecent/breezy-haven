'use client';
import {
  Button,
  DataTable,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type Booking,
} from '@/shared';
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
  MoreHorizontalIcon,
  PencilIcon,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export function BookingTable({ bookings }: BookingTableProps) {
  return <DataTable columns={columns} data={[...bookings]} />;
}

function EditAction({
  booking,
}: {
  booking: BookingTableProps['bookings'][number];
}) {
  // const dispatch = useDispatch();

  return (
    <DropdownMenuItem
      onClick={async () => {
        await new Promise(resolve => setTimeout(resolve, 300)); // give some time for DropdownMenu to cleanup aria-hidden, avoid warning accessibility
        // return dispatch(cabinFormActions.openUpdateForm(cabin));
      }}
    >
      <PencilIcon /> Edit
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

// function DeleteAction({ cabinId }: { cabinId: BookingTableProps['bookings'][number] }) {
//   return (
//     <DropdownMenuItem
//       onClick={() =>
//         toast.warning('Are you sure to delete this cabin?', {
//           action: {
//             label: 'Yes',
//             onClick: () =>
//               toast.promise(deleteCabinAction(cabinId), {
//                 loading: 'Deleting...',
//                 success: `Cabin ${cabinId} has been deleted!`,
//                 error: 'An error has  occurred!',
//               }),
//           },
//         })
//       }
//     >
//       <Trash2Icon />
//       Delete
//     </DropdownMenuItem>
//   );
// }

const cabinInfoColumn: ColumnDef<BookingTableProps['bookings'][number]> = {
  header: 'Cabin Info',
  columns: [
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
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Status'} />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={`${StatusStyle[status]} rounded-full px-4 py-2 font-semibold tracking-tighter uppercase`}
          >
            {status}
          </span>
        );
      },
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
          ${row.original.totalPrice.toFixed(2)}
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
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CopyAction booking={row.original} />
            <EditAction booking={row.original} />
            {/* <DeleteAction cabinId={row.original.id} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
} as const;

const columns: ColumnDef<BookingTableProps['bookings'][number]>[] = [
  cabinInfoColumn,
  guestInfoColumn,
  bookingInfoColumn,
  actionColumn,
];

const StatusStyle: Record<Booking['status'], string> = {
  unconfirmed: 'bg-sky-200 text-sky-700',
  'checked-in': 'bg-emerald-200 text-emerald-700',
  'checked-out': 'bg-slate-300 text-slate-700',
};

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
