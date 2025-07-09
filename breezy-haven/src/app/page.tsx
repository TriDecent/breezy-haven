import Image from 'next/image';
import Link from 'next/link';
import backgroundImage from '../../public/bg.png';

export default function Page() {
  return (
    <>
      <div className='absolute inset-0'>
        <Image
          src={backgroundImage}
          alt='Mountains and forests with two cabins'
          fill
          quality='100'
          placeholder='blur'
          className='object-cover object-top'
        />
      </div>

      <section>
        <div className='relative z-10 text-center'>
          <h1 className='text-primary-50 mb-10 text-2xl font-normal tracking-widest lg:text-6xl xl:text-6xl'>
            Welcome to paradise.
          </h1>
          <Link
            href='/cabins'
            className='bg-accent-500 text-primary-800 hover:bg-accent-600 rounded px-6 py-4 font-semibold transition-all select-none lg:px-8 lg:py-6 lg:text-lg xl:text-xl'
          >
            Explore luxury cabins
          </Link>
        </div>
      </section>
    </>
  );
}
