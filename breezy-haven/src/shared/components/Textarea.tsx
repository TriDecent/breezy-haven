import { ComponentProps } from 'react';
import { Textarea as TextareaUI } from './ui/textarea';

export default function Textarea({
  ...props
}: ComponentProps<typeof TextareaUI>) {
  return <TextareaUI {...props} />;
}
