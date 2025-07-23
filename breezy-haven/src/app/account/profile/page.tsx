import { SelectCountry, UpdateProfileForm } from '@/features/account/profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My profile',
};

export default function Page() {
  // CHANGE
  const nationality = 'Germany';

  return (
    <div>
      <h2 className='text-accent-400 mb-4 text-xl font-bold tracking-wide lg:text-2xl'>
        Update your guest profile
      </h2>

      <p className='text-primary-200 mb-8 text-lg'>
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm
        countrySelector={
          <SelectCountry
            name='nationality'
            id='nationality'
            className='bg-primary-200 text-primary-800 w-full rounded-sm px-5 py-3 shadow-sm'
            defaultCountry={nationality}
          />
        }
      />
    </div>
  );
}
