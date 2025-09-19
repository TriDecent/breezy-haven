'use client';
import { DTOCabin, NonNullableObject } from '@/repositories';
import { PreviewImage } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { PriorityContext } from '@/shared/providers';
import { UsersIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { use } from 'react';

export default function CabinCard({
  cabin,
}: {
  cabin: NonNullableObject<DTOCabin>;
}) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;
  const isPriority = use(PriorityContext);

  return (
    <article className='border-primary-800 0 hover:shadow-accent-600 active:shadow-accent-600 flex flex-col overflow-hidden rounded-md border transition duration-100 hover:scale-105 hover:shadow-md active:scale-105 active:shadow-md lg:flex-row'>
      <div className='relative h-48 lg:h-auto lg:w-42'>
        <PreviewImage
          src={image}
          alt={`Cabin ${name}`}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
          priority={isPriority}
          className='border-primary-800 object-cover object-center lg:border-r'
        />
      </div>

      <div className='flex-1'>
        <div className='bg-primary-950 px-7 pt-5 pb-4'>
          <h3 className='text-accent-500 mb-3 text-xl font-bold md:text-2xl md:font-semibold'>
            Cabin {name}
          </h3>

          <div className='mb-2 flex items-center gap-3'>
            <UsersIcon className='text-primary-600 h-5 w-5' />
            <p className='text-primary-200 text-lg'>
              For up to <span className='font-bold'>{maxCapacity}</span> guests
            </p>
          </div>

          <p className='flex items-baseline justify-end gap-3'>
            {discount > 0 ? (
              <>
                <span className='text-3xl font-[350]'>
                  ${regularPrice - discount}
                </span>
                <span className='text-primary-600 font-semibold line-through'>
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className='text-3xl font-[350]'>${regularPrice}</span>
            )}
            <span className='text-primary-200'>/ night</span>
          </p>
        </div>

        <div className='bg-primary-950 border-t-primary-800 border-t text-right'>
          <Link
            href={`${ROUTES.cabins.href}/${id}`}
            prefetch={true} // /cabin/[cabinId] is ISR route so this is not that necessary
            className='border-primary-800 hover:bg-accent-600 hover:text-primary-900 group active:bg-accent-600 inline-block border-l px-6 py-4 transition-all'
          >
            Details & reservation{' '}
            <span className='text-accent-600 group-hover:text-primary-900 animate-pulse text-2xl'>
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
