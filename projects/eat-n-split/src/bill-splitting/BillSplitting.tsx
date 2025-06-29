import { Card, Input, PrimaryButton } from '../shared';

export default function BillSplitting() {
  return (
    <Card>
      <h2 className='text-lg font-bold tracking-wider uppercase'>
        Split a bill with clare
      </h2>
      <form className='flex flex-col gap-2'>
        <Input
          id='billValue'
          labelText='💵 Bill value'
          name='billValue'
          type='number'
        />
        <Input
          id='myExpense'
          labelText='🧑 Your expense'
          name='myExpense'
          type='number'
        />
        <Input
          id='friendExpense'
          labelText="👭 Clare's expense"
          name='friendExpense'
          type='number'
        />
        <div className='mb-4 flex flex-col md:flex-row md:items-center'>
          <label htmlFor='payer' className='mr-4'>
            Who is paying the bill
          </label>
          <select
            id='payer'
            name='payer'
            defaultValue='me'
            className='rounded bg-white px-4 py-1 outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 focus:ring-offset-amber-300'
          >
            <option value='me'>You</option>
            <option value='clare'>Clare</option>
          </select>
        </div>

        <PrimaryButton className='md:self-end'>Add</PrimaryButton>
      </form>
    </Card>
  );
}
