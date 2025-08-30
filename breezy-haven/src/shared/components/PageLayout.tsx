/* eslint-disable react/display-name */
import Image from 'next/image';
import type { ReactNode } from 'react';
import facebookLogo from '../../../public/facebook-logo.png';

interface PageLayoutProps {
  readonly children?: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className='flex min-h-screen flex-col'>{children}</div>
);

PageLayout.Header = ({ children }: PageLayoutProps) => (
  <header className='container mx-auto'>{children}</header>
);

PageLayout.Main = ({ children }: PageLayoutProps) => (
  <main className='container mx-auto flex flex-1 flex-col p-4 lg:py-8'>
    {children}
  </main>
);

PageLayout.Footer = ({ children }: PageLayoutProps) => (
  <footer className='w-full'>
    {children ?? (
      <div className='py-2 text-center text-sm text-gray-500 md:py-4'>
        <div className='flex justify-center gap-4'>
          <a
            href='https://www.facebook.com/Tridecent/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 transition-colors hover:text-gray-800'
          >
            <Image
              src={facebookLogo}
              alt='github logo'
              className='h-12 w-auto'
              quality={75}
              priority
            />
          </a>
          <a
            href='https://github.com/TriDecent'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 transition-colors hover:text-blue-700'
          >
            <Image
              src='/github-logo.webp'
              alt='facebook logo'
              width={360}
              height={180}
              className='h-12 w-auto'
            />
          </a>
        </div>
        <div>© {new Date().getFullYear()} Trí Decent</div>
      </div>
    )}
  </footer>
);

export default PageLayout;
