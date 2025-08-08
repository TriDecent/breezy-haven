import about1Image from '@/../public/about-1.jpg';
import { cabinService } from '@/services';
import { METADATA, Spinner } from '@/shared';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return METADATA.about.metadata;
}

export default async function Page() {
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
              Where nature&apos;s beauty and comfortable living blend
              seamlessly. Hidden away in the heart of the Italian Dolomites,
              this is your paradise away from home. But it&apos;s not just about
              the luxury cabins. It&apos;s about the experience of reconnecting
              with nature and enjoying simple pleasures with family.
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

        <div className='relative order-2 aspect-square md:order-1 md:col-span-2'>
          <Image
            src='/about-2.jpg'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            alt='Family that manages The Breezy Haven'
            fill
          />
        </div>

        <div className='order-1 md:order-2 md:col-span-3'>
          <h2 className='text-accent-400 mb-4 text-2xl font-medium lg:mb-10 lg:text-4xl'>
            Managed by our family since 1962
          </h2>

          <div className='space-y-4 lg:space-y-8'>
            <p>
              Since 1962, The Breezy Haven has been a cherished family-run
              retreat. Started by our grandparents, this haven has been nurtured
              with love and care, passing down through our family as a testament
              to our dedication to creating a warm, welcoming environment.
            </p>
            <p>
              Over the years, we&apos;ve maintained the essence of The Breezy
              Haven, blending the timeless beauty of the mountains with the
              personal touch only a family business can offer. Here, you&apos;re
              not just a guest; you&apos;re part of our extended family. So join
              us at The Breezy Haven soon, where tradition meets tranquility,
              and every visit is like coming home.
            </p>
          </div>
        </div>
      </div>
      <Link
        href='/cabins'
        className='bg-accent-500 text-primary-800 hover:bg-accent-600 mt-8 block animate-pulse px-4 py-3 text-center text-lg font-semibold transition-all select-none md:mx-auto md:w-fit md:px-8 md:py-6'
      >
        Explore our luxury cabins
      </Link>
    </section>
  );
}

async function BreezyHavenIntroduction() {
  const { count, error } = await cabinService.getCount();

  if (error) throw new Error(error.message);

  if (!count) notFound();

  return (
    <p>
      Our {count} luxury cabins provide a cozy base, but the real freedom and
      peace you&apos;ll find in the surrounding mountains. Wander through lush
      forests, breathe in the fresh air, and watch the stars twinkle above from
      the warmth of a campfire or your hot tub.
    </p>
  );
}
