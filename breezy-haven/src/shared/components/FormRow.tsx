import {
  type ComponentProps,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../utils/utils';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

type FormRowProps =
  | ({
      kind: 'input';
    } & ComponentProps<typeof InputField>)
  | ({
      kind: 'textarea';
    } & ComponentProps<typeof TextareaField>)
  | ({ kind: 'select' } & ComponentProps<typeof SelectField>);

export function FormRow(props: FormRowProps) {
  const { kind, ...rest } = props;

  switch (kind) {
    case 'input':
      return <InputField {...(rest as ComponentProps<typeof InputField>)} />; // Ts cannot infer
    case 'textarea':
      return (
        <TextareaField {...(rest as ComponentProps<typeof TextareaField>)} /> // Ts cannot infer
      );
    case 'select':
      return <SelectField {...(rest as ComponentProps<typeof SelectField>)} />; // Ts cannot infer
    default:
      return null;
  }
}

function InputField({
  id,
  name,
  labelText,
  labelClassname,
  error,
  className,
  ...props
}: {
  id: string;
  name: string;
  labelText: string;
  labelClassname?: string;
  className?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
      <label htmlFor={id} className={cn(labelClassname)}>
        {labelText}
      </label>
      <Input
        id={id}
        name={name}
        {...props}
        className={cn(
          'flex-2 read-only:cursor-not-allowed',
          error ? 'error border-red-600/75' : '',
          className
        )}
      />
      {error ? (
        <p className='flex-1 text-red-500 first-letter:capitalize'>{error}</p>
      ) : null}
    </div>
  );
}

function TextareaField({
  id,
  name,
  labelText,
  error,
  labelClassname,
  className,
  ...props
}: {
  id: string;
  name: string;
  labelText: string;
  labelClassname: string;
  className?: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className='flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
      <label htmlFor={id} className={cn(labelClassname)}>
        {labelText}
      </label>
      <Textarea
        id={id}
        name={name}
        className={cn(
          'flex-2 read-only:cursor-not-allowed',
          error ? 'error border-red-600/75' : '',
          className
        )}
        {...props}
      />
      {error ? (
        <p className='flex-1 text-red-500 first-letter:capitalize'>{error}</p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  labelText,
  placeholder,
  renderSelectItems,
  labelClassName,
  ...props
}: {
  id: string;
  name: string;
  labelText: string;
  placeholder: string;
  renderSelectItems: ReactNode;
  labelClassName?: string;
} & ComponentProps<typeof Select>) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id} className={cn(labelClassName)}>
        {labelText}
      </Label>
      <Select name={name} {...props}>
        <SelectTrigger id={id} className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{renderSelectItems}</SelectContent>
      </Select>
    </div>
  );
}
