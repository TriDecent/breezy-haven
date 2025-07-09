import { Metadata } from 'next';
import { Counter } from '../../shared';

export const metadata: Metadata = {
  title: 'Cabins',
};

export default function Page() {
  return (
    <>
      <h1>Cabin Page</h1>

      <Counter />
    </>
  );
}
