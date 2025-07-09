import { Metadata } from 'next';
import { Logo, Navigation, PageLayout } from '../shared';
import '../styles/globals.css';

import { NextFont } from 'next/dist/compiled/@next/font';
import { Josefin_Sans } from 'next/font/google';

const josefin: NextFont = Josefin_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s - The Breezy Haven',
    default: 'The Breezy Haven',
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
    <html lang='en'>
      <body className={`bg-primary-950 text-primary-100 ${josefin.className} antialiased`}>
        <PageLayout>
          <PageLayout.Header>
            <div className='mx-auto flex items-center justify-between p-2 md:p-6 lg:p-8'>
              <Logo />
              <Navigation />
            </div>
          </PageLayout.Header>
          <PageLayout.Main>{children}</PageLayout.Main>
          <PageLayout.Footer />
        </PageLayout>
      </body>
    </html>
  );
}
