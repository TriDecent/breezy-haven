import PreviewImage from '@/features/cabins/PreviewImage';
import { cabinService } from '@/services';
import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';
import { notFound } from 'next/navigation';

const iconComponents = (maxCapacity: number) =>
  [
    <>
      <UsersIcon className='text-accent-600 h-5 w-5' />
      <p className='text-lg'>
        For up to <span className='font-bold'>{maxCapacity}</span> guests
      </p>
    </>,
    <>
      <MapPinIcon className='text-accent-600 h-5 w-5' />
      <p className='text-lg'>
        Located in the heart of the <span className='font-bold'>Dolomites</span>{' '}
        (Italy)
      </p>
    </>,
    <>
      <EyeSlashIcon className='text-accent-600 h-5 w-5' />
      <p className='text-lg'>
        Privacy <span className='font-bold'>100%</span> guaranteed
      </p>
    </>,
  ] as const;

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
    <section>
      <article className='md:border-primary-800 mb-12 flex flex-col gap-4 rounded-md md:mb-24 md:flex-row md:gap-16 md:border md:px-8 md:py-6'>
        <div className='shadow-accent-500/65 relative h-64 overflow-hidden rounded-2xl md:h-148 md:flex-2/5 md:-translate-x-3 md:translate-y-4 md:scale-[1.2] md:shadow-[10px_15px_10px] lg:-translate-x-4 lg:-translate-y-3.5 lg:scale-[1.15] xl:scale-[1.2]'>
          <PreviewImage
            src={data.image}
            alt={`Cabin ${data.name}`}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority
            className='object-cover'
          />
        </div>

        <div className='md:flex-3/5'>
          <h3 className='bg-primary-950 w-max rounded text-center text-2xl leading-loose font-black tracking-wide md:-translate-x-2/5 md:pt-2 md:pl-6 md:text-left md:text-7xl'>
            <p className='from-accent-300 to-accent-600 via-accent-500 bg-gradient-to-r from-5% bg-clip-text text-transparent'>
              Cabin {data.name}
            </p>
          </h3>

          <p className='text-primary-300 mb-10 md:text-lg'>
            {data.description}
          </p>

          <ul className='flex flex-col gap-4'>
            {iconComponents(data.maxCapacity).map((icon, index) => (
              <li key={index} className='flex items-center gap-3'>
                {icon}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <h2 className='text-accent-500 text-center text-xl font-semibold tracking-wide md:text-5xl'>
        Reserve today. Pay on arrival.
      </h2>
    </section>
  );
}
