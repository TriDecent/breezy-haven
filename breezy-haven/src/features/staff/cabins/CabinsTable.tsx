'use client';

import {
  Button,
  cabinFormActions,
  DataTable,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Input,
  type Cabin,
} from '@/shared';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CopyIcon,
  CopyPlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { duplicateCabinAction } from './actions/duplicateCabinAction';
import { deleteCabinAction } from './deleteCabinAction';

const columns: ColumnDef<Cabin>[] = [
  {
    header: 'Cabin Info',
    columns: [
      {
        accessorKey: 'image',
        header: '',
        cell: ({ row }) => {
          const cabin = row.original;

          return (
            <div className='relative mx-auto aspect-video w-52 overflow-hidden rounded-md'>
              <Image
                src={cabin.image}
                alt='A cabin image'
                fill
                quality={75}
                sizes='(max-width: 768px) 100vw, 208px'
                draggable={false}
                className='object-cover object-center'
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Name'
            className='py-2'
          />
        ),
      },
      {
        accessorKey: 'maxCapacity',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Max capacity'
            className='py-2'
          />
        ),
      },
      {
        accessorKey: 'regularPrice',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Price'
            className='py-2'
          />
        ),
      },
      {
        accessorKey: 'discount',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Discount'
            className='py-2'
          />
        ),
        cell: ({ row }) =>
          row.original.discount === 0 ? (
            <span>&mdash;</span>
          ) : (
            row.original.discount
          ),
      },
    ],
  },
  {
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
              <CopyAction cabin={row.original} />
              <EditAction cabin={row.original} />
              <DuplicateAction cabin={row.original} />
              <DeleteAction cabinId={row.original.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
  },
];

export function CabinsTable({ cabins }: { cabins: readonly Cabin[] }) {
  return (
    <>
      <DataTable
        data={[...cabins]}
        columns={columns}
        filter={table => (
          <div className='mt-4 flex gap-2'>
            <Input
              id='filter'
              placeholder='Filter by name...'
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={e =>
                table.getColumn('name')?.setFilterValue(e.target.value)
              }
            />
          </div>
        )}
      />
    </>
  );
}

function EditAction({ cabin }: { cabin: Cabin }) {
  const dispatch = useDispatch();

  return (
    <DropdownMenuItem
      onClick={async () => {
        await new Promise(resolve => setTimeout(resolve, 300)); // give some time for DropdownMenu to cleanup aria-hidden, avoid warning accessibility
        return dispatch(cabinFormActions.openUpdateForm(cabin));
      }}
    >
      <PencilIcon /> Edit
    </DropdownMenuItem>
  );
}

function CopyAction({ cabin }: { cabin: Cabin }) {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await navigator.clipboard.writeText(JSON.stringify(cabin));
        toast.success('Copy successfully!');
      }}
    >
      <CopyIcon /> Copy info
    </DropdownMenuItem>
  );
}

function DeleteAction({ cabinId }: { cabinId: Cabin['id'] }) {
  return (
    <DropdownMenuItem
      onClick={() =>
        toast.warning('Are you sure to delete this cabin?', {
          action: {
            label: 'Yes',
            onClick: () =>
              toast.promise(deleteCabinAction(cabinId), {
                loading: 'Deleting...',
                success: `Cabin ${cabinId} has been deleted!`,
                error: 'An error has  occurred!',
              }),
          },
        })
      }
    >
      <Trash2Icon />
      Delete
    </DropdownMenuItem>
  );
}

function DuplicateAction({
  cabin,
}: {
  cabin: Omit<Cabin, 'id' | 'created_at'>;
}) {
  const handleDuplicateAction = useCallback(
    () =>
      toast.promise(duplicateCabinAction(cabin), {
        loading: 'Duplicating cabin...',
        error: 'An error has occurred while trying to duplicate the cabin',
        success: 'Duplicate the cabin successfully!',
      }),

    [cabin]
  );

  return (
    <DropdownMenuItem asChild>
      <button onClick={handleDuplicateAction}>
        <CopyPlusIcon /> Duplicate
      </button>
    </DropdownMenuItem>
  );
}

// import publicImage from '@/../public/bg.png';
// const cabins: Array<{
//   image: string;
//   name: string;
//   capacity: number;
//   regularPrice: number;
//   discount: number;
// }> = [
//   {
//     image: publicImage as unknown as string,
//     name: 'Cozy Cabin',
//     capacity: 4,
//     regularPrice: 120,
//     discount: 10,
//   },
//   {
//     image: publicImage as unknown as string,
//     name: 'Mountain Retreat',
//     capacity: 6,
//     regularPrice: 180,
//     discount: 20,
//   },
//   {
//     image: publicImage as unknown as string,
//     name: 'Lakeside Lodge',
//     capacity: 8,
//     regularPrice: 250,
//     discount: 15,
//   },
//   {
//     image: publicImage as unknown as string,
//     name: 'Forest Hideaway',
//     capacity: 2,
//     regularPrice: 90,
//     discount: 5,
//   },
// ];
