import { Input, PrimaryButton } from '../shared';

export default function Friends() {
  return (
    <>
      <article className='flex items-center justify-between rounded-lg p-2'>
        <div className='flex items-center'>
          <img
            src='https://i.pinimg.com/originals/77/60/3d/77603de4ebcb8bfa5011afeb7dc17539.jpg'
            alt='a person avatar'
            loading='lazy'
            className='w-16 rounded-full object-center'
          />
          <p className='ml-2 flex flex-col'>
            <span className='text-lg font-bold tracking-wide'>Clare</span>
            <span className='text-red-500'>Clare owes you $999</span>
          </p>
        </div>
        <PrimaryButton>Select</PrimaryButton>
      </article>

      <article className='flex items-center justify-between rounded-lg bg-amber-100/70 p-2'>
        <div className='flex items-center'>
          <img
            src='https://i.pinimg.com/originals/77/60/3d/77603de4ebcb8bfa5011afeb7dc17539.jpg'
            alt='a person avatar'
            loading='lazy'
            className='w-16 rounded-full object-center'
          />
          <p className='ml-2 flex flex-col'>
            <span className='text-lg font-bold tracking-wide'>Clare</span>
            <span className='text-green-500'>You owe Clare $1</span>
          </p>
        </div>

        <PrimaryButton>Select</PrimaryButton>
      </article>

      <article className='flex items-center justify-between rounded-lg p-2'>
        <div className='flex items-center'>
          <img
            src='https://i.pinimg.com/originals/77/60/3d/77603de4ebcb8bfa5011afeb7dc17539.jpg'
            alt='a person avatar'
            loading='lazy'
            className='w-16 rounded-full object-center'
          />
          <p className='ml-2 flex flex-col'>
            <span className='text-lg font-bold tracking-wide'>Clare</span>
            <span className='text-red-500'>Clare owes you $999</span>
          </p>
        </div>
        <PrimaryButton>Select</PrimaryButton>
      </article>

      <form className='flex flex-col gap-2 rounded-lg bg-amber-100/70 p-4 shadow-xs shadow-black'>
        <Input
          id='friendName'
          labelText='👭 Friend name'
          name='friendName'
          type='text'
        />

        <Input id='url' labelText='📷 Image URL' name='url' type='text' />

        <PrimaryButton className='mt-4 md:self-end'>Add</PrimaryButton>
      </form>
    </>
  );
}
