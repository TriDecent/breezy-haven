import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { z } from 'zod';
import { Input, PrimaryButton } from '../shared';

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
type FormErrors = Readonly<Partial<FormValues>>;
interface FormState {
  readonly userEntered: FormValues | null;
  readonly errors: FormErrors | null;
}

export default function BillSplittingForm({
  friendName,
}: {
  friendName: string;
}) {
  const [didFormSubmitSuccess, setDidFormSubmitSuccess] = useState(false);

  const splittingAction = (
    _state: FormState,
    formData: FormData
  ): FormState => {
    const userEntered = Object.fromEntries(formData) as unknown as FormValues;

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

    // if (result.data.payer === 'me') {
    //   const amount =
    //     result.data.billValue -
    //     (result.data.myExpense + result.data.friendExpense);
    // }

    setDidFormSubmitSuccess(true);

    return {
      userEntered: null,
      errors: null,
    };
  };
  const [formState, formAction] = useActionState<FormState, FormData>(
    splittingAction,
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
      console.log('reset cái qq');
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

      <PrimaryButton className='md:self-end'>Add</PrimaryButton>
    </form>
  );
}
