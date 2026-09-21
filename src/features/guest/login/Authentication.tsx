'use client';
import { Variants } from '@/shared/animations';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';
import z from 'zod';
import { LoginCard } from './LoginCard';
import { SignupCard } from './SignupCard';

const AuthValidator = z.literal(['login', 'signup']);
type AuthMode = z.infer<typeof AuthValidator>;

export function Authentication() {
  const searchParams = useSearchParams();
  const authMode = useMemo<AuthMode>(() => {
    const parsed = AuthValidator.safeParse(searchParams.get('mode'));
    if (parsed.success) return parsed.data;

    return 'login';
  }, [searchParams]);

  return (
    <AnimatePresence mode='wait'>
      {authMode === 'login' ? (
        <motion.div
          key='login'
          variants={Variants.slide.variant(0, 30)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
          className='w-full max-w-xl'
        >
          <LoginCard />
        </motion.div>
      ) : (
        <motion.div
          key='signup'
          variants={Variants.slide.variant(0, 30)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
          className='w-full max-w-xl'
        >
          <SignupCard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
