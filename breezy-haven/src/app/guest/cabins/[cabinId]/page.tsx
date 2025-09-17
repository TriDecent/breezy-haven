import { CabinDetail, Reservation } from '@/features/guest/cabins';
import { unauthCabinService } from '@/services';

import { CabinSchema } from '@/shared/schemas';
import { errorHelper } from '@/shared/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

export const revalidate = 2592000;

interface PageParams {
  readonly params: Promise<{ cabinId: string }>;
}

export async function generateStaticParams(): Promise<
  {
    readonly cabinId: string;
  }[]
> {
  const { data: cabins } = await unauthCabinService.getAll();

  return cabins
    ? cabins.map(cabin => ({
        cabinId: cabin.id.toString(),
      }))
    : [];
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { cabinId } = await params;
  const { data: cabin, errors: cabinError } = await unauthCabinService.getById(
    Number(cabinId)
  );

  if (cabinError && cabinError.type === 'database')
    return {
      title:
        cabinError.db.code !== 'PGRST116'
          ? `Error: ${cabinError.db.message}`
          : 'Cabin not found',
    };

  if (!cabin) return { title: 'Cabin not found' };

  return { title: `Cabin ${cabin.name}` };
}

export default async function Page({ params }: PageParams) {
  const { cabinId } = await params;

  if (Number.isNaN(Number(cabinId))) notFound();

  const cabinResult = await unauthCabinService.getById(Number(cabinId));

  if (cabinResult.errors) {
    if (
      cabinResult.errors.type === 'database' &&
      cabinResult.errors.db.code === 'PGRST116'
    ) {
      notFound();
    }
    throw errorHelper.handleError(cabinResult.errors);
  }

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
