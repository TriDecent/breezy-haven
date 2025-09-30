'use client';
import { FormRow } from '@/shared/components';
import { SignupForm } from '@/shared/components/auth';
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

  const renderOtherFields = useCallback(
    (state: CreateStaffResponse, isPending: boolean) => (
      <>
        <FormRow
          id='avatar'
          name='avatar'
          labelText='Avatar'
          kind='input'
          type='file'
          disabled={isPending}
          labelClassname='min-w-36'
          accept='.png, .jpg, .jpeg'
          error={state.errors?.avatar?.[0]}
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
    <SignupForm
      action={createStaffAction}
      initialState={{
        errors: null,
        userEntered: null,
      }}
      signUpText={'Create new staff'}
      onSignupSuccessAction={handleSignupSuccess}
      onSignupFailedAction={handleSignupFailed}
      renderOtherFieldsAction={renderOtherFields}
    />
  );
}
