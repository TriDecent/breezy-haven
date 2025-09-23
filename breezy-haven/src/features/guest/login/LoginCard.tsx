import { cn } from '@/lib/utils';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components';

import { type JSX } from 'react';

export function LoginCard({
  renderLoginByProviders,
  renderLoginByEmailPassword,
  onSignupClick,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  onSignupClick: () => void;
  renderLoginByProviders: JSX.Element;
  renderLoginByEmailPassword: JSX.Element;
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='flex flex-col gap-4'>{renderLoginByProviders}</div>
            <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
              <span className='bg-card text-muted-foreground relative z-10 px-2'>
                Or continue with
              </span>
            </div>

            {renderLoginByEmailPassword}
          </div>
        </CardContent>
        <CardFooter className='justify-center text-sm'>
          <span className='text-muted-foreground'>
            Don&apos;t have an account?
          </span>
          <Button
            variant='link'
            className='dark:underline animate-pulse'
            onClick={onSignupClick}
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
