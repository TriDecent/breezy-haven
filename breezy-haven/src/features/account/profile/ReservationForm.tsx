import { PrimaryButton } from '@/shared';

export default function ReservationForm() {
  // CHANGE
  const maxCapacity = 23;

  return (
    <article className='md:order-2'>
      <div className='bg-primary-800 text-primary-300 flex items-center justify-between rounded-t-lg px-8 py-4 md:px-16'>
        <p>Logged in as</p>

        {/* <div className='flex gap-4 items-center'>
          <img
            // Important to display google profile images
            referrerPolicy='no-referrer'
            className='h-8 rounded-full'
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div> */}
      </div>

      <form className='bg-primary-900 flex flex-col gap-5 rounded-b-lg px-4 py-5 text-lg sm:px-8 md:py-10 xl:px-16'>
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='bg-primary-200 text-primary-800 w-full rounded-sm px-5 py-3 shadow-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='bg-primary-200 text-primary-800 w-full rounded-sm px-5 py-3 shadow-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-end'>
          <div className='md:order-2'>
            <PrimaryButton>Reserve now</PrimaryButton>
          </div>
          <p className='text-primary-300 self-center text-base md:order-1'>
            Start by selecting dates
          </p>
        </div>
      </form>
    </article>
  );
}
