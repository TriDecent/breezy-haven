'use client';
import { Form, FormRow } from '@/shared/components';
import authApi from '@/shared/store/auth-api';
import { Save } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  updateProfileAction,
  type UpdateProfileResponse,
} from '../actions/update-profile-action';

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
  const dispatch = useDispatch();

  const handleFormSuccess = useCallback(() => {
    toast.success('Update profile successfully');
    dispatch(
      authApi.util.invalidateTags([{ type: 'StaffAuth', id: 'CURRENT' }])
    );
  }, [dispatch]);

  const handleFormError = useCallback(
    () => toast.error('Update profile failed'),
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

  const handleRenderFields = useCallback(
    (state: UpdateProfileResponse, isPending: boolean) => (
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
            state.payload.userEntered?.fullName ?? defaultProfile.fullName
          }
          error={state.payload.errors?.fullName?.[0]}
          disabled={isPending}
        />

        <FormRow
          kind='input'
          type='file'
          accept='.png, .jpg, .jpeg'
          id='avatar'
          name='avatar'
          labelText='Avatar'
          labelClassname='min-w-20'
          error={state.payload.errors?.avatar?.[0]}
          disabled={isPending}
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
    ),
    [
      defaultProfile.email,
      defaultProfile.fullName,
      handleFileChange,
      previewImgUrl,
    ]
  );

  const handleRenderUnexpectedErrors = useCallback(
    (state: UpdateProfileResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-red-500'>{state.payload.errors.unexpected}</p>
      ) : null,
    []
  );

  return (
    <Form
      action={updateProfileAction}
      initialState={{
        type: 'initial',
        payload: { userEntered: null, errors: null },
      }}
      onFormSuccess={handleFormSuccess}
      onFormError={handleFormError}
      submitNode={
        <>
          <Save /> Save changes
        </>
      }
      renderFields={handleRenderFields}
      renderUnexpectedErrors={handleRenderUnexpectedErrors}
    />
  );
}
