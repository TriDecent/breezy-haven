import { useActionState } from 'react';
import {
  friendActions,
  friendSchema,
  Input,
  PrimaryButton,
  type FriendType,
} from '../shared';
import { useDispatch } from 'react-redux';

type FormValues = Omit<FriendType, 'id'>;
type FormErrors = Partial<FormValues>;
interface FormState {
  readonly errors: FormErrors | null;
  readonly userEntered: FormValues | null;
}

export default function AddingFriendForm({
  toggleAddFriendForm,
}: {
  toggleAddFriendForm: () => void;
}) {
  const dispatch = useDispatch();

  const addFriendAction = (
    _state: FormState,
    formData: FormData
  ): FormState => {
    const userEntered: FormValues = Object.fromEntries(
      formData
    ) as unknown as FormValues;

    const result = friendSchema.safeParse(userEntered);

    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.errors.map(error => [error.path[0], error.message])
      ) as FormErrors;

      return {
        errors: errors,
        userEntered: userEntered,
      };
    }

    dispatch(friendActions.addFriend(result.data));

    return {
      errors: null,
      userEntered: null,
    };
  };
  const [formState, formAction] = useActionState<FormState, FormData>(
    addFriendAction,
    {
      errors: null,
      userEntered: null,
    }
  );

  return (
    <form
      action={formAction}
      className='flex flex-col gap-2 rounded-lg bg-amber-100/70 p-4 shadow-xs shadow-black'
    >
      <div>
        <Input
          id='friendName'
          labelText='👭 Friend name'
          name='name'
          type='text'
          autoComplete='name'
          defaultValue={formState.userEntered?.name}
          className={formState.errors?.name ? 'ring-1 ring-red-500' : ''}
        />
        {formState.errors?.name ? (
          <p className='text-end text-red-500'>{formState.errors.name}</p>
        ) : null}
      </div>
      <div>
        <Input
          id='url'
          labelText='📷 Image URL'
          name='imgSrc'
          type='text'
          defaultValue={formState.userEntered?.imgSrc}
          className={formState.errors?.imgSrc ? 'ring-1 ring-red-500' : ''}
        />
        {formState.errors?.imgSrc ? (
          <p className='text-end text-red-500'>{formState.errors.imgSrc}</p>
        ) : null}
      </div>

      <div className='mt-4 flex gap-4 md:self-end'>
        <PrimaryButton type='submit'>Add</PrimaryButton>
        <PrimaryButton type='button' onClick={toggleAddFriendForm}>
          Close
        </PrimaryButton>
      </div>
    </form>
  );
}
