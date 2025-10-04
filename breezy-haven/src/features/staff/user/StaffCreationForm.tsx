'use client';
import { Form, FormRow } from '@/shared/components';
import { UserPlus2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  createStaffAction,
  type CreateStaffResponse,
} from './create-staff-action';

export function StaffCreationForm() {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleSignupSuccess = useCallback(() => {
    toast.success('Create new staff successfully!');
    setPreviewImageUrl(null);
  }, []);

  const handleSignupFailed = useCallback(() => {
    toast.error('Create new staff failed!');
    setPreviewImageUrl(null);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 1024 * 1024) {
        e.target.value = '';
        setPreviewImageUrl(null);

        toast.warning('Image size must not exceed 1MB');
        return;
      }
      if (
        !file.type.startsWith('image/') ||
        !['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
      ) {
        e.target.value = '';
        setPreviewImageUrl(null);
        toast.warning('Only JPG, PNG and JPEG images are allowed');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
    },
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: CreateStaffResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-red-500'>{state.payload.errors.unexpected}</p>
      ) : null,
    []
  );

  const renderOtherFields = useCallback(
    (state: CreateStaffResponse, isPending: boolean) => (
      <>
        <FormRow
          id='fullName'
          name='fullName'
          labelText='Full name'
          kind='input'
          type='text'
          disabled={isPending}
          autoComplete='name webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.fullName}
          error={state.payload.errors?.fullName?.[0]}
        />
        <FormRow
          id='email'
          name='email'
          labelText='Email'
          kind='input'
          type='email'
          disabled={isPending}
          autoComplete='email webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.email}
          error={state.payload.errors?.email?.[0]}
        />
        <FormRow
          id='password'
          name='password'
          labelText='Password'
          kind='input'
          type='password'
          disabled={isPending}
          autoComplete='new-password webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.password}
          error={state.payload.errors?.password?.[0]}
        />
        <FormRow
          id='confirmedPassword'
          name='confirmedPassword'
          labelText='Repeat password'
          kind='input'
          type='password'
          disabled={isPending}
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.confirmedPassword}
          error={state.payload.errors?.confirmedPassword?.[0]}
        />

        <FormRow
          id='avatar'
          name='avatar'
          labelText='Avatar'
          kind='input'
          type='file'
          disabled={isPending}
          labelClassname='min-w-36'
          accept='.png, .jpg, .jpeg'
          error={state.payload.errors?.avatar?.[0]}
          onChange={handleFileChange}
        />

        {previewImageUrl ? (
          <div className='relative aspect-video overflow-hidden rounded-lg md:min-w-2xs md:self-end'>
            <Image
              src={previewImageUrl}
              alt='staff avatar'
              fill
              className='mask-y-from-95% mask-x-from-80% object-cover'
            />
          </div>
        ) : null}
      </>
    ),
    [previewImageUrl, handleFileChange]
  );

  return (
    <Form<CreateStaffResponse>
      action={createStaffAction}
      initialState={{
        type: 'initial',
        payload: {
          errors: null,
          userEntered: null,
        },
      }}
      onFormSuccess={handleSignupSuccess}
      onFormError={handleSignupFailed}
      renderUnexpectedErrors={renderUnexpectedErrors}
      submitNode={
        <>
          <UserPlus2 /> Create new staff
        </>
      }
      renderFields={renderOtherFields}
    />
  );
}
