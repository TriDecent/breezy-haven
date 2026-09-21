'use cache';

import about1Image from '@/../public/about-1.jpg';
import about2Image from '@/../public/about-2.jpeg';
import { unauthCabinService } from '@/services';
import { Spinner } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  cacheLife('default-strategy');
  return ROUTES.about.metadata;
}

export default async function Page() {
  cacheLife('default-strategy');

  return (
    <section>
      <h1 className='text-accent-400 mb-4 text-end text-2xl tracking-widest lg:text-4xl'>
        About us
      </h1>
      <div className='grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-5 md:items-center md:gap-x-8 lg:gap-x-24 lg:gap-y-32'>
        <div className='md:col-span-3'>
          <h2 className='text-accent-400 mb-4 text-2xl font-medium lg:mb-10 lg:text-4xl'>
            Welcome to The Breezy Haven
          </h2>

          <div className='space-y-4 lg:space-y-8'>
            <p>
              Where the charm of nature meets the comfort of refined living.
              Nestled deep in the heart of the Italian Dolomites, this tranquil
              retreat is your sanctuary away from the everyday. But The Breezy
              Haven is more than just luxurious cabins — it&apos;s about
              rediscovering the joy of simplicity, reconnecting with nature, and
              sharing meaningful moments with loved ones.
            </p>
            <Suspense fallback={<Spinner />}>
              <BreezyHavenIntroduction />
            </Suspense>
            <p>
              This is where memorable moments are made, surrounded by
              nature&apos;s splendor. It&apos;s a place to slow down, relax, and
              feel the joy of being together in a beautiful setting.
            </p>
          </div>
        </div>

        <Image
          src={about1Image}
          alt='Family sitting around a fire pit in front of cabin'
          placeholder='blur'
          className='md:col-span-2'
        />

        <Image
          src={about2Image}
          alt='Family that manages The Breezy Haven'
          placeholder='blur'
          quality={50}
          className='relative order-2 aspect-square md:order-1 md:col-span-2'
        />

        <div className='order-1 md:order-2 md:col-span-3'>
          <h2 className='text-accent-400 mb-4 text-2xl font-medium lg:mb-10 lg:text-4xl'>
            A Family Legacy Since 1954
          </h2>

          <div className='space-y-4 lg:space-y-8'>
            <p>
              The Breezy Haven has been lovingly managed by our family for
              generations. Founded by our grandparents in 1954, this retreat has
              grown with care and devotion, passed down through the years as a
              symbol of our commitment to hospitality and warmth.
            </p>
            <p>
              We&apos;ve preserved the soul of The Breezy Haven — blending
              timeless alpine beauty with the personal touch only a family-run
              destination can offer. Here, you&apos;re not just a guest —
              you&apos;re part of our story. Come join us, where tradition meets
              serenity, and every visit feels like coming home.
            </p>
          </div>
        </div>
      </div>
      <Link
        href={ROUTES.cabins.href}
        className='bg-accent-500 text-primary-800 hover:bg-accent-600 mt-8 block animate-pulse px-4 py-3 text-center text-lg font-semibold transition-all select-none md:mx-auto md:w-fit md:px-8 md:py-6'
      >
        Explore our luxury cabins
      </Link>
    </section>
  );
}

async function BreezyHavenIntroduction() {
  cacheLife('default-strategy');

  const getCountResult = await unauthCabinService.getCount();

  if (getCountResult.type === 'error')
    throw new Error(getCountResult.payload.message);

  return (
    <p>
      Our collection of {getCountResult.payload} premium cabins offers a cozy
      home base, but the true magic lies in the surrounding wilderness. Wander
      through lush forests, breathe in crisp mountain air, and gaze at the stars
      from beside a crackling fire or your private hot tub.
    </p>
  );
}
