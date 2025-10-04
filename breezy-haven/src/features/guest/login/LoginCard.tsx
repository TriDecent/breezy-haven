import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import GoogleLogin from './GoogleLogin';
import { LoginForm } from './LoginForm';

export function LoginCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='flex flex-col gap-4'>
              <GoogleLogin />
            </div>
            <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
              <span className='bg-card text-muted-foreground relative z-10 px-2'>
                Or continue with
              </span>
            </div>

            <LoginForm />
          </div>
        </CardContent>
        <CardFooter className='justify-center text-sm'>
          <span className='text-muted-foreground'>
            Don&apos;t have an account?
          </span>
          <Button
            variant='link'
            className='animate-pulse dark:underline'
            asChild
          >
            <Link
              href={`${ROUTES.login.href}?mode=signup`}
              replace
              scroll={false}
            >
              Sign up
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
