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
  Input,
} from '@/shared/components';
import type { Cabin } from '@/shared/schemas';
import { cabinFormActions } from '@/shared/store';
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
    header: 'Select All',
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
  },
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
        cell: ({ row }) =>
          `$${row.original.regularPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
      {
        id: 'discount',
        accessorFn: ({ regularPrice, discount }) =>
          (discount * regularPrice) / 100,
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
            <span className='text-green-500'>{`$${((row.original.discount * row.original.regularPrice) / 100).toFixed(2)}`}</span>
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

export function CabinsTable({ cabins }: { cabins: Cabin[] }) {
  return (
    <DataTable
      data={cabins}
      columns={columns}
      render={table => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const totalRows = table.getFilteredRowModel().rows.length;

        const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
        const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

        return (
          <div className='mt-4 flex flex-col items-center gap-2'>
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

            <p className='text-muted-foreground text-sm'>
              Showing{' '}
              <span className='text-foreground text-base'>{firstRow}</span> to{' '}
              <span className='text-foreground text-base'>{lastRow}</span> of{' '}
              <span className='text-foreground text-base'>{totalRows}</span>{' '}
              results
            </p>
          </div>
        );
      }}
    />
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
