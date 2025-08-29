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
  Input,
  type Cabin,
} from '@/shared';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { deleteCabinAction } from './deleteCabinAction';

const columns: ColumnDef<
  Pick<
    Cabin,
    'id' | 'image' | 'name' | 'regularPrice' | 'discount' | 'maxCapacity'
  >
>[] = [
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
              <DropdownMenuItem
                onClick={() =>
                  toast.warning('Are you sure to delete this cabin?', {
                    action: {
                      label: 'Yes',
                      onClick: () =>
                        toast.promise(deleteCabinAction(row.original.id), {
                          loading: 'Deleting...',
                          success: `Cabin ${row.original.id} has been deleted!`,
                          error: 'An error has  occurred!',
                        }),
                    },
                  })
                }
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    JSON.stringify(row.original)
                  );
                  toast.success('Copy successfully!');
                }}
              >
                <CopyIcon /> Copy info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
  },
];

export function CabinsTable({ cabins }: { cabins: readonly Cabin[] }) {
  return (
    <DataTable
      data={[...cabins]}
      columns={columns}
      filter={table => (
        <div className='mt-4 flex gap-2'>
          <Input
            id='filter'
            placeholder='Filter by name...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={e =>
              table.getColumn('name')?.setFilterValue(e.target.value)
            }
          />
        </div>
      )}
    />
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
