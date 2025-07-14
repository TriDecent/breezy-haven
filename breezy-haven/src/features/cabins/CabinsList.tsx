import { cabinService } from '@/services';
import CabinCard from './CabinCard';

export default async function CabinsList() {
  const { data: cabins, error } = await cabinService.getAll();

  return error ? (
    <p>
      {error.code}: {error.message}
    </p>
  ) : cabins.length > 0 ? (
    <section>
      <ul className='grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))] lg:gap-12 xl:gap-14'>
        {cabins.map(cabin => (
          <li key={cabin.id}>
            <CabinCard cabin={cabin} />
          </li>
        ))}
      </ul>
    </section>
  ) : null;
}
