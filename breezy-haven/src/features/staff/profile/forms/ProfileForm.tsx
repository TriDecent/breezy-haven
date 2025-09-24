'use client';
import { Form, FormRow } from '@/shared/components';
import { Save } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { updateProfileAction } from '../actions/updateProfileAction';

interface ProfileFormProps {
  readonly defaultProfile: Readonly<{
    email: string;
    fullName: string;
    avatarUrl: string;
  }>;
}

export function ProfileForm({ defaultProfile }: ProfileFormProps) {
  const [previewImgUrl, setPreviewImgUrl] = useState<string>(
    defaultProfile.avatarUrl
  );

  const handleFormSuccess = useCallback(
    () => toast.success('Update profile successfully'),
    []
  );

  const handleFormError = useCallback(
    () => toast.success('Update profile failed'),
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 1024 * 1024) {
        e.target.value = '';
        toast.warning('Image size must not exceed 1MB');
        return;
      }
      if (
        !file.type.startsWith('image/') ||
        !['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
      ) {
        e.target.value = '';
        toast.warning('Only JPG, PNG and JPEG images are allowed');
        return;
      }
      setPreviewImgUrl(URL.createObjectURL(file));
    },
    []
  );
  return (
    <Form
      action={updateProfileAction}
      initialState={{ userEntered: null, errors: null }}
      onFormSuccess={handleFormSuccess}
      onFormError={handleFormError}
      submitNode={
        <>
          <Save /> Save changes
        </>
      }
      renderFields={(state, isPending) => (
        <>
          <FormRow
            kind='input'
            id='email'
            name='email'
            labelText='Email'
            autoComplete='none'
            labelClassname='min-w-20'
            defaultValue={defaultProfile.email}
            readOnly
          />

          <FormRow
            kind='input'
            id='fullName'
            name='fullName'
            labelText='Full name'
            labelClassname='min-w-20'
            defaultValue={
              state.userEntered?.fullName ?? defaultProfile.fullName
            }
            error={state.errors?.fullName?.[0]}
            readOnly={isPending}
          />

          <FormRow
            kind='input'
            type='file'
            accept='.png, .jpg, .jpeg'
            id='avatar'
            name='avatar'
            labelText='Avatar'
            labelClassname='min-w-20'
            error={state.errors?.avatar?.[0]}
            readOnly={isPending}
            onChange={handleFileChange}
          />

          <div className='relative aspect-video overflow-hidden rounded-lg md:min-w-2xs md:self-end'>
            <Image
              src={previewImgUrl}
              alt='staff avatar'
              fill
              className='mask-y-from-95% mask-x-from-80% object-cover'
            />
          </div>
        </>
      )}
      renderUnexpectedErrors={() => <></>}
    />
  );
}
