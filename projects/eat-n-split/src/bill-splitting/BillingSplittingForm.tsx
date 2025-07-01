import type { UnknownAction } from '@reduxjs/toolkit/react';
import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
} from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { Input, PrimaryButton, uiActions } from '../shared';

const billingShape = {
  billValue: z.coerce
    .number({ message: 'Bill value must be number' })
    .min(0, { message: 'Bill value must be at least 0' }),
  myExpense: z.coerce
    .number({ message: 'Your expense value must be number' })
    .min(0, { message: 'Your expense value must be at least 0' }),
  friendExpense: z.coerce
    .number({ message: "Your friend's expense value must be number" })
    .min(0, { message: "Your friend's expense value must be at least 0" }),
  payer: z.string().refine(payer => payer === 'me' || payer === 'friend', {
    message: 'Payer must be you or your friend',
  }),
};

const billingSchema = z
  .object(billingShape)
  .refine(data => data.friendExpense <= data.billValue, {
    message: 'Your friend paid much more than the bill value',
    path: ['friendExpense'],
  })
  .refine(data => data.myExpense <= data.billValue, {
    message: 'You paid much more than the bill value',
    path: ['myExpense'],
  });

type FormValues = Readonly<z.infer<typeof billingSchema>>;
type FormErrors = Readonly<Partial<FormValues & { splittingSubmit: string }>>;
interface FormState {
  readonly userEntered: FormValues | null;
  readonly errors: FormErrors | null;
}

const splittingAction =
  (
    setFormSubmitSuccessState: (state: boolean) => void,
    dispatch: Dispatch<UnknownAction>,
    didTheBillSplitted: boolean,
    splittingPersonId: string
  ) =>
  (_state: FormState, formData: FormData): FormState => {
    const userEntered = Object.fromEntries(formData) as unknown as FormValues;

    if (didTheBillSplitted) {
      return {
        userEntered: null,
        errors: { splittingSubmit: 'You two have already splitted the bill' },
      };
    }

    const result = billingSchema.safeParse(userEntered);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.errors.map(error => [error.path[0], error.message])
      ) as FormErrors;

      return {
        userEntered,
        errors,
      };
    }

    const gap = result.data.myExpense - result.data.friendExpense;

    if (gap > 0) {
      dispatch(
        uiActions.setDebtsOwnedToMe({
          personId: splittingPersonId,
          amount: result.data.billValue - result.data.friendExpense,
        })
      );
    } else if (gap < 0) {
      dispatch(
        uiActions.setDebtsIOwe({
          personId: splittingPersonId,
          amount: result.data.billValue - result.data.myExpense,
        })
      );
    }

    setFormSubmitSuccessState(true);

    return {
      userEntered: null,
      errors: null,
    };
  };

export default function BillSplittingForm({
  friendId,
  friendName,
  didTheBillSplitted,
}: {
  friendId: string;
  friendName: string;
  didTheBillSplitted: boolean;
}) {
  const [didFormSubmitSuccess, setDidFormSubmitSuccess] = useState(false);
  const dispatch = useDispatch();

  const [formState, formAction] = useActionState<FormState, FormData>(
    splittingAction(
      setDidFormSubmitSuccess,
      dispatch,
      didTheBillSplitted,
      friendId
    ),
    {
      userEntered: null,
      errors: null,
    }
  );

  const [payer, setPayer] = useState<FormValues['payer']>('me');
  const [billValue, setBillValue] = useState<string>('');
  const [myExpense, setMyExpense] = useState<string>('');
  const [friendExpense, setFriendExpense] = useState<string>('');

  const theRest =
    payer === 'me'
      ? Number(billValue) - Number(myExpense)
      : Number(billValue) - Number(friendExpense);
  const theRestExpense = Math.max(0, Math.round(theRest * 100) / 100);

  useEffect(() => {
    if (didFormSubmitSuccess) {
      setPayer('me');
      setBillValue('');
      setMyExpense('');
      setFriendExpense('');
      setDidFormSubmitSuccess(false);
    }
  }, [didFormSubmitSuccess]);

  const selectRef = useRef<HTMLSelectElement>(null);

  useLayoutEffect(() => {
    if (selectRef.current && selectRef.current.value !== payer) {
      selectRef.current.value = payer;
    }
  }, [payer, formState]);

  return (
    <form action={formAction} className='flex flex-col gap-2'>
      <div>
        <Input
          id='billValue'
          labelText='💵 Bill value'
          name='billValue'
          value={billValue}
          onChange={e => {
            setBillValue(e.target.value);
          }}
          className={
            formState.errors?.billValue ? 'ring-1 ring-red-500' : undefined
          }
        />
        {formState.errors?.billValue ? (
          <p className='text-red-500'>{formState.errors.billValue}</p>
        ) : null}
      </div>
      <div>
        <Input
          id='myExpense'
          labelText='🧑 Your expense'
          name='myExpense'
          value={payer === 'friend' ? theRestExpense : myExpense}
          readOnly={payer === 'friend'}
          onChange={e => {
            setMyExpense(e.target.value);
          }}
          className={
            formState.errors?.myExpense ? 'ring-1 ring-red-500' : undefined
          }
        />
        {formState.errors?.myExpense ? (
          <p className='text-red-500'>{formState.errors.myExpense}</p>
        ) : null}
      </div>
      <div>
        <Input
          id='friendExpense'
          labelText={`👭 ${friendName}'s expense`}
          name='friendExpense'
          value={payer === 'me' ? theRestExpense : friendExpense}
          readOnly={payer === 'me'}
          onChange={e => {
            setFriendExpense(e.target.value);
          }}
          className={
            formState.errors?.friendExpense ? 'ring-1 ring-red-500' : undefined
          }
        />
        {formState.errors?.friendExpense ? (
          <p className='text-red-500'>{formState.errors.friendExpense}</p>
        ) : null}
      </div>
      <div>
        <div className='mb-4 flex flex-col md:flex-row md:items-center'>
          <label htmlFor='payer' className='mr-4'>
            Who is paying the bill
          </label>
          <select
            ref={selectRef}
            id='payer'
            name='payer'
            value={payer}
            onChange={e => {
              setPayer(e.target.value as 'me' | 'friend');
            }}
            className='rounded bg-white px-4 py-1 outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 focus:ring-offset-amber-300'
          >
            <option value='me'>You</option>
            <option value='friend'>{friendName}</option>
          </select>
        </div>
        {formState.errors?.payer ? (
          <p className='text-red-500'>{formState.errors.payer}</p>
        ) : null}
      </div>

      <PrimaryButton
        className='disabled:bg-amber-200 disabled:hover:cursor-not-allowed md:self-end'
        disabled={didTheBillSplitted}
      >
        {didTheBillSplitted
          ? "You've already splitted the bill"
          : 'Split the bill'}
      </PrimaryButton>
      {formState.errors?.splittingSubmit ? (
        <p className='text-center text-red-500'>
          {formState.errors.splittingSubmit}
        </p>
      ) : null}
    </form>
  );
}
