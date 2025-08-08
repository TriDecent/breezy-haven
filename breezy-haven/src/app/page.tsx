import backgroundImage from '@/../public/bg.png';
import Image from 'next/image';
import Link from 'next/link';

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

      <section className='relative z-10 text-center'>
        <h1 className='text-primary-50 mb-10 text-2xl font-normal tracking-widest lg:text-6xl xl:text-6xl'>
          Welcome to paradise.
        </h1>
        <Link
          href='/cabins'
          className='text-primary-800 shadow-accent-600 hover:shadow-accent-800 active:shadow-accent-800 from-accent-300 via-accent-400 to-accent-500 rounded bg-gradient-to-l from-5% px-6 py-4 font-semibold shadow-[15px_0_50px] transition-all select-none lg:px-8 lg:py-6 lg:text-lg xl:text-xl'
        >
          Explore luxury cabins
        </Link>
      </section>
    </>
  );
}
