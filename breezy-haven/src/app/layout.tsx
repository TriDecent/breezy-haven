import {
  Logo,
  Navigation,
  NavTrail,
  PageLayout,
  PageProgressBar,
  RootProvider,
  ThemeProvider,
  ThemeToggle,
} from '@/shared';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { NextFont } from 'next/dist/compiled/@next/font';

import { Josefin_Sans } from 'next/font/google';

const josefin: NextFont = Josefin_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s - The Breezy Haven',
    default: 'Welcome to The Breezy Haven',
  },
  icons: '/logo.png',
  description:
    'A high-end cabin retreat nestled deep within the Italian Dolomites, embraced by enchanting and shadowy woodlands.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${josefin.className} antialiased`}>
        <RootProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <PageLayout>
              <PageLayout.Header>
                <div className='mx-auto flex items-center justify-between p-2 md:p-6 lg:p-8'>
                  <Logo />
                  <Navigation />
                  <ThemeToggle />
                </div>
                <div className='px-4 md:px-8 lg:px-12'>
                  <NavTrail />
                </div>
              </PageLayout.Header>
              <PageLayout.Main>{children}</PageLayout.Main>
              <PageLayout.Footer />
            </PageLayout>
            <div id='mini-sidebar' className='md:hidden'></div>
            <div id='image-previewing'></div>
            <PageProgressBar />
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
