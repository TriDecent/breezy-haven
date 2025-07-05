import { Metadata } from 'next';
import './index.css';
import { Logo, Navigation } from './shared';

export const metadata: Metadata = {
  title: 'The Breezy Haven',
  icons: '/logo.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main className='min-h-screen'>{children}</main>
        <footer>Copyright by TriDecent {new Date().getFullYear()}</footer>
      </body>
    </html>
  );
}
