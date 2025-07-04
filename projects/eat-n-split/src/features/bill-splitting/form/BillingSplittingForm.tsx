import {
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { useDispatch } from 'react-redux';
import { Input, PrimaryButton } from '../../../shared';
import { splittingAction, type FormState, type FormValues } from './action';

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
      <FormInputGroup
        id='billValue'
        labelText='💵 Bill value'
        name='billValue'
        value={billValue}
        onChange={e => {
          setBillValue(e.target.value);
        }}
        error={formState.errors?.billValue}
      />
      <FormInputGroup
        id='myExpense'
        labelText='🧑 Your expense'
        name='myExpense'
        value={payer === 'friend' ? theRestExpense : myExpense}
        readOnly={payer === 'friend'}
        onChange={e => {
          setMyExpense(e.target.value);
        }}
        error={formState.errors?.myExpense}
      />
      <FormInputGroup
        id='friendExpense'
        labelText={`👭 ${friendName}'s expense`}
        name='friendExpense'
        value={payer === 'me' ? theRestExpense : friendExpense}
        readOnly={payer === 'me'}
        onChange={e => {
          setFriendExpense(e.target.value);
        }}
        error={formState.errors?.friendExpense}
      />

      <PayerSelect
        payer={payer}
        onPayerChanged={newPayer => {
          setPayer(newPayer);
        }}
        friendName={friendName}
        selectRef={selectRef}
      />

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

function FormInputGroup({
  id,
  labelText,
  error,
  ...rest
}: {
  id: string;
  labelText: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Input id={id} labelText={labelText} {...rest} />
      {error ? <p className='text-red-500'>{error}</p> : null}
    </div>
  );
}

function PayerSelect({
  payer,
  onPayerChanged,
  friendName,
  error,
  selectRef,
}: {
  payer: string;
  onPayerChanged: (newPayer: 'me' | 'friend') => void;
  friendName: string;
  error?: string;
  selectRef: React.RefObject<HTMLSelectElement | null>;
}) {
  return (
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
          onPayerChanged(e.target.value as 'me' | 'friend');
        }}
        className='rounded bg-white px-4 py-1 outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 focus:ring-offset-amber-300'
      >
        <option value='me'>You</option>
        <option value='friend'>{friendName}</option>
      </select>
      {error ? <p className='text-red-500'>{error}</p> : null}
    </div>
  );
}
