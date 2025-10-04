'use client';
import { Variants } from '@/shared/animations';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import GoogleLogin from './GoogleLogin';
import { LoginCard } from './LoginCard';
import { LoginForm } from './LoginForm';
import { SignupCard } from './SignupCard';

export function Authentication() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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
          <LoginCard
            renderLoginByProviders={<GoogleLogin />}
            renderLoginByEmailPassword={<LoginForm />}
            onSignupClick={() => setAuthMode('signup')}
          />
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
          <SignupCard onGoBackAction={() => setAuthMode('login')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
