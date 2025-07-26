import { CabinDetail, Reservation } from '@/features/cabins';
import { cabinService } from '@/services';

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
  const ids = cabins.map(cabin => ({
    cabinId: cabin.id.toString(),
  }));

  return ids;
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

  return (
    <>
      <section>
        <CabinDetail cabin={cabinResult.data} />
      </section>

      <section>
        <h2 className='text-accent-500 mb-8 text-center text-xl font-semibold tracking-wide md:text-5xl'>
          Reserve {cabinResult.data.name} today. Pay on arrival.
        </h2>

        <div className='flex flex-col gap-4 md:flex-row'>
          <Suspense fallback={<Loading />}>
            <Reservation cabin={cabinResult.data} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
