import { Spinner } from '@/shared';

export default function Loading() {
  return (
    <>
      <Spinner />
      <p className='text-center'>Loading cabin data...</p>
    </>
  );
}
