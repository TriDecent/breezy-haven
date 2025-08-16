import { CabinDetail, Reservation } from '@/features/cabins';
import { cabinService } from '@/services';

import { CabinSchema } from '@/shared';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

export const revalidate = 3600;

interface PageParams {
  readonly params: Promise<{ cabinId: string }>;
}

export async function generateStaticParams(): Promise<
  {
    readonly cabinId: string;
  }[]
> {
  const { data: cabins } = await cabinService.getAll();

  return cabins.map(cabin => ({
    cabinId: cabin.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { cabinId } = await params;
  const { data: cabin, error: cabinError } = await cabinService.getById(
    Number(cabinId)
  );

  if (cabinError) {
    if (cabinError.code !== 'PGRST116')
      return { title: `Error: ${cabinError.message}` };

    return { title: 'Cabin not found' };
  }

  if (!cabin) return { title: 'Cabin not found' };

  return { title: `Cabin ${cabin.name}` };
}

export default async function Page({ params }: PageParams) {
  const { cabinId } = await params;

  if (Number.isNaN(Number(cabinId))) notFound();

  const cabinResult = await cabinService.getById(Number(cabinId));

  if (cabinResult.error) {
    if (cabinResult.error.code !== 'PGRST116')
      throw new Error(cabinResult.error.message);

    notFound();
  }

  if (!cabinResult.data) notFound();

  const parsedCabin = CabinSchema.safeParse(cabinResult.data);
  if (!parsedCabin.success)
    throw new Error('Something is wrong with this cabin');

  return (
    <>
      <section>
        <CabinDetail cabin={parsedCabin.data} />
      </section>

      <section>
        <h2 className='text-accent-500 mb-8 text-center text-xl font-semibold tracking-wide md:text-5xl'>
          Reserve {cabinResult.data.name} today. Pay on arrival.
        </h2>

        <div className='flex flex-col gap-4 lg:flex-row'>
          <Suspense fallback={<Loading />}>
            <Reservation cabin={parsedCabin.data} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
