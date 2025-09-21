'use client';
import { Button, CardAction, FormRow } from '@/shared/components';
import { Pen } from 'lucide-react';
import Form from 'next/form';
import Image from 'next/image';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  createStaffAction,
  type CreateStaffResponse,
} from './createStaffAction';

const useStaffCreationForm = (state: CreateStaffResponse) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!state.isSuccess) return;
    toast.success('Create new staff successfully!');
  }, [state]);

  useEffect(() => {
    if (!state.errors) return;
    console.log(state.errors);
    toast.error('Create new staff failed!');
  }, [state]);

  useEffect(() => {
    if (!state.isSuccess) return;
    setPreviewImageUrl(null);
    setSelectedFile(null);
  }, [state]);

  return {
    previewImageUrl,
    setPreviewImageUrl,
    selectedFile,
    setSelectedFile,
  };
};

export function StaffCreationForm() {
  const [state, dispatch, isPending] = useActionState<
    CreateStaffResponse,
    FormData
  >(createStaffAction, {
    errors: null,
    userEntered: null,
  });

  const { previewImageUrl, setPreviewImageUrl, selectedFile, setSelectedFile } =
    useStaffCreationForm(state);

  return (
    <Form
      action={formData => {
        if (selectedFile) formData.set('avatar', selectedFile);

        dispatch(formData);
      }}
      className='flex flex-col gap-6'
    >
      <FormRow
        id='fullName'
        name='fullName'
        labelText='Full name'
        kind='input'
        type='text'
        readOnly={isPending}
        autoComplete='name webauthn'
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.fullName}
        error={state.errors?.fullName?.[0]}
      />
      <FormRow
        id='email'
        name='email'
        labelText='Email'
        kind='input'
        type='email'
        readOnly={isPending}
        autoComplete='email webauthn'
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.email}
        error={state.errors?.email?.[0]}
      />
      <FormRow
        id='password'
        name='password'
        labelText='Password'
        kind='input'
        type='password'
        readOnly={isPending}
        autoComplete='new-password webauthn'
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.password}
        error={state.errors?.password?.[0]}
      />
      <FormRow
        id='confirmedPassword'
        name='confirmedPassword'
        labelText='Repeat password'
        kind='input'
        type='password'
        readOnly={isPending}
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.confirmedPassword}
        error={state.errors?.confirmedPassword?.[0]}
      />

      <FormRow
        id='avatar'
        name='avatar'
        labelText='Avatar'
        kind='input'
        type='file'
        readOnly={isPending}
        labelClassname='min-w-36'
        accept='.png, .jpg, .jpeg'
        error={state.errors?.avatar?.[0]}
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 1024 * 1024) {
            toast.warning('Image size must not exceed 1MB');
            return;
          }
          if (
            !file.type.startsWith('image/') ||
            !['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
          ) {
            toast.warning('Only JPG, PNG and JPEG images are allowed');
            return;
          }
          const previewUrl = URL.createObjectURL(file);
          setPreviewImageUrl(previewUrl);
          setSelectedFile(file);
        }}
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

      <CardAction className='flex gap-4 self-end'>
        <Button variant='ghost' type='reset' disabled={isPending}>
          Cancel
        </Button>
        <Button variant='secondary' type='submit' disabled={isPending}>
          <Pen /> Create new user
        </Button>
      </CardAction>
      {state.errors?.unexpected ? (
        <p className='text-red-500'>{state.errors.unexpected}</p>
      ) : null}
    </Form>
  );
}
