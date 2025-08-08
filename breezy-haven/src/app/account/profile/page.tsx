import { SelectCountry, UpdateProfileForm } from '@/features/account/profile';
import { METADATA } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = METADATA.account.nested.profile.metadata;

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
            defaultCountry={nationality}
          />
        }
      />
    </div>
  );
}
