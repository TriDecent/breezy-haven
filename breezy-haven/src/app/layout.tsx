import { Metadata } from 'next';
import { Logo, Navigation } from '../shared';
import '../styles/globals.css';

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
      <body className='bg-primary-950 text-primary-100 min-h-screen'>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>Copyright by TriDecent {new Date().getFullYear()}</footer>
      </body>
    </html>
  );
}
