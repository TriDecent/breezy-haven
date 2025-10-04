import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/shared/components';
import { ArrowLeft, UserPen } from 'lucide-react';
import { SignupForm } from './SignupForm';

export function SignupCard({ onGoBackAction }: { onGoBackAction: () => void }) {
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
        <SignupForm />
      </CardContent>
    </Card>
  );
}
