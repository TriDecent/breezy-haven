import { Cabin } from '@/repositories';
import { UsersIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import PreviewImage from './PreviewImage';

export default function CabinCard({ cabin }: { cabin: Cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;

  return (
    <article className='border-primary-800 0 flex flex-col overflow-hidden rounded-md border lg:flex-row'>
      <div className='relative h-48 lg:h-auto lg:w-42'>
        <PreviewImage
          src={image}
          alt={`Cabin ${name}`}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
          className='border-primary-800 object-cover object-center lg:border-r'
        />
        <div className='pointer-events-none absolute top-0 h-10 w-full bg-gradient-to-b from-slate-900 to-transparent lg:top-0 lg:bottom-0 lg:left-0 lg:h-full lg:w-6 lg:bg-gradient-to-r'></div>
        <div className='pointer-events-none absolute bottom-0 h-10 w-full bg-gradient-to-t from-slate-900 to-transparent lg:top-0 lg:right-0 lg:bottom-0 lg:h-full lg:w-6 lg:bg-gradient-to-l'></div>
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
            href={`/cabins/${id}`}
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
