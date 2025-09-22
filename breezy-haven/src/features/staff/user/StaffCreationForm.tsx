'use client';
import { FormRow } from '@/shared/components';
import { SignupForm } from '@/shared/components/auth';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { createStaffAction } from './createStaffAction';

export function StaffCreationForm() {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const setSelectedFile = useState<File | null>(null)[1];

  return (
    <SignupForm
      action={createStaffAction}
      initialState={{
        errors: null,
        userEntered: null,
      }}
      signUpText={'Create new staff'}
      onSignupSuccessAction={() =>
        toast.success('Create new staff successfully!')
      }
      onSignupFailedAction={() => toast.error('Create new staff failed!')}
      renderOtherFieldsAction={(state, isPending) => (
        <>
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
        </>
      )}
    />
  );
}
