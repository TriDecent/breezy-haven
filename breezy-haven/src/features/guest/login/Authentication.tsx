'use client';
import { SignupForm } from '@/shared/components/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import GoogleLogin from './GoogleLogin';
import { LoginCard } from './LoginCard';
import { LoginForm } from './LoginForm';
import { signupAction } from './signup-action';

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

import { Variants } from '@/shared/animations';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/shared/components';
import { ArrowLeft, UserPen } from 'lucide-react';

export function SignupCard({ onGoBackAction }: { onGoBackAction: () => void }) {
  const handleSignupSuccess = useCallback(
    () => toast.success('Sign up successfully'),
    []
  );
  const handleSignupFailed = useCallback(
    () =>
      //  TODO: change this after implementation
      toast.error("This feature isn't available yet. Please check back later"),
    []
  );

  return (
    <Card className='mx-auto max-w-5xl'>
      <CardHeader>
        <span className='flex items-center gap-2 text-lg font-medium'>
          <UserPen /> Sign up
        </span>
        <CardAction>
          <Button
            onClick={onGoBackAction}
            variant='gradient'
            className='animate-pulse'
          >
            <ArrowLeft /> Log in
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SignupForm
          action={signupAction}
          initialState={{
            type: 'initial',
            payload: { userEntered: null, errors: null },
          }}
          signUpText={'Sign up'}
          onSignupSuccessAction={handleSignupSuccess}
          onSignupFailedAction={handleSignupFailed}
        />
      </CardContent>
    </Card>
  );
}
