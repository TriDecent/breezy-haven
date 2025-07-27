import { Auth } from '@/lib';
import { Session } from 'next-auth';
import NavItemList from './NavItemList';

export default async function Navigation() {
  const session: Session | null = await Auth.auth();

  return (
    <nav className='z-10 md:text-xl'>
      <ul className='flex items-center gap-4 sm:gap-6 lg:gap-16'>
        {!session?.user ? (
          <NavItemList />
        ) : (
          <NavItemList
            authName={session.user.name}
            authImage={session.user.image}
          />
        )}
      </ul>
    </nav>
  );
}
