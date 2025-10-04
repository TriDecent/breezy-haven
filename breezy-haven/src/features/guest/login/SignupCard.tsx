import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { ArrowLeft, UserPen } from 'lucide-react';
import Link from 'next/link';
import { SignupForm } from './SignupForm';

export function SignupCard() {
  return (
    <Card className='mx-auto max-w-5xl'>
      <CardHeader>
        <span className='flex items-center gap-2 text-lg font-medium'>
          <UserPen /> Sign up
        </span>
        <CardAction>
          <Button variant='gradient' className='animate-pulse' asChild>
            <Link
              href={`${ROUTES.login.href}?mode=login`}
              replace
              scroll={false}
            >
              <ArrowLeft /> Log in
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
