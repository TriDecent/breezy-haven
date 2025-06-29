import type { ReactNode } from 'react';
import facebookLogo from '../../assets/facebook-logo.png';
import githubLogo from '../../assets/github-logo.webp';

interface PageLayoutProps {
  children?: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className='flex min-h-screen flex-col'>{children}</div>
);

PageLayout.Header = ({ children }: PageLayoutProps) => (
  <header className='inset-x-0 top-0 z-10 w-full'>{children}</header>
);

PageLayout.Main = ({ children }: PageLayoutProps) => (
  <main className='container mx-auto flex flex-1 flex-col p-4 lg:py-8'>
    {children}
  </main>
);

PageLayout.Footer = ({ children }: PageLayoutProps) => (
  <footer className='w-full'>
    {children ?? (
      <div className='py-4 text-center text-sm text-gray-500'>
        <div className='flex justify-center gap-4'>
          <a
            href='https://github.com/TriDecent'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 transition-colors hover:text-gray-800'
          >
            <img src={githubLogo} alt='github logo' className='h-12' />
          </a>
          <a
            href='https://www.facebook.com/Tridecent/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 transition-colors hover:text-blue-700'
          >
            <img src={facebookLogo} alt='facebook logo' className='h-12' />
          </a>
        </div>
        <div>© {new Date().getFullYear()} Trí Decent</div>
      </div>
    )}
  </footer>
);

export default PageLayout;
