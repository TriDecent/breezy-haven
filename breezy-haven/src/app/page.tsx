import backgroundImage from '@/../public/bg.png';
import { Logo, PageLayout, ThemeToggle } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Navigation } from 'lucide-react';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = ROUTES.home.metadata;

export default function Page() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <div className='mx-auto flex items-center justify-between p-2 md:p-6 lg:p-8'>
          <Logo />
          <Navigation />
          <ThemeToggle />
        </div>
      </PageLayout.Header>
      <PageLayout.Main>
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
            href={ROUTES.cabins.href}
            className='text-primary-800 shadow-accent-600 hover:shadow-accent-800 active:shadow-accent-800 from-accent-300 via-accent-400 to-accent-500 rounded bg-gradient-to-l from-5% px-6 py-4 font-semibold shadow-[15px_0_50px] transition-all select-none lg:px-8 lg:py-6 lg:text-lg xl:text-xl'
          >
            Explore luxury cabins
          </Link>
        </section>
      </PageLayout.Main>
      <PageLayout.Footer />
    </PageLayout>
  );
}
