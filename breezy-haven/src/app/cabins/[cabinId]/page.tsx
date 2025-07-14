import { cabinService } from '@/services';
import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const { cabinId } = await params;

  const { data, error } = await cabinService.getById(Number(cabinId));

  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <section className='mx-auto mt-8 max-w-6xl'>
      <div className='border-primary-800 mb-24 grid grid-cols-[3fr_4fr] gap-20 border px-10 py-3'>
        <div className='relative -translate-x-3 scale-[1.15]'>
          <Image
            src={data.image}
            alt={`Cabin ${data.name}`}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover'
          />
        </div>

        <div>
          <h3 className='text-accent-100 bg-primary-950 mb-5 w-[150%] translate-x-[-254px] p-6 pb-1 text-7xl font-black'>
            Cabin {data.name}
          </h3>

          <p className='text-primary-300 mb-10 text-lg'>{data.description}</p>

          <ul className='mb-7 flex flex-col gap-4'>
            <li className='flex items-center gap-3'>
              <UsersIcon className='text-primary-600 h-5 w-5' />
              <span className='text-lg'>
                For up to <span className='font-bold'>{data.maxCapacity}</span>{' '}
                guests
              </span>
            </li>
            <li className='flex items-center gap-3'>
              <MapPinIcon className='text-primary-600 h-5 w-5' />
              <span className='text-lg'>
                Located in the heart of the{' '}
                <span className='font-bold'>Dolomites</span> (Italy)
              </span>
            </li>
            <li className='flex items-center gap-3'>
              <EyeSlashIcon className='text-primary-600 h-5 w-5' />
              <span className='text-lg'>
                Privacy <span className='font-bold'>100%</span> guaranteed
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className='text-center text-5xl font-semibold'>
          Reserve today. Pay on arrival.
        </h2>
      </div>
    </section>
  );
}
