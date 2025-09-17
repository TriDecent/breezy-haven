import { PageProgressBar } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { RootProvider, ThemeProvider } from '@/shared/providers';
import '@/styles/globals.css';

import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import type { NextFont } from 'next/dist/compiled/@next/font';

import { Josefin_Sans } from 'next/font/google';

const josefin: NextFont = Josefin_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = ROUTES.root.metadata;

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
            {children}
            <div id='mini-sidebar' className='md:hidden'></div>
            <div id='image-previewing'></div>
            <div id='modal'></div>
            <PageProgressBar />
          </ThemeProvider>
        </RootProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
