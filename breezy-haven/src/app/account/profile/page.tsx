import {
  guestFormSchema,
  SelectCountry,
  UpdateProfileForm,
} from '@/features/account/profile';
import { Auth, getCountries } from '@/lib';
import { guestService } from '@/services';
import { METADATA } from '@/shared';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = METADATA.account.nested.profile.metadata;

export default async function Page() {
  const session = await Auth.getFullSessionAsync();
  if (!session.main || !session.main.email) redirect(METADATA.login.href);

  const [dtoGuest, countries] = await Promise.all([
    guestService.getByEmailAsync(session.main.email),
    getCountries(),
  ]);

  const safeGuest = guestFormSchema.safeParse(dtoGuest);

  if (!safeGuest.success) {
    return (
      <div>
        <h2 className='text-center text-2xl font-bold text-red-500'>
          Something is wrong with your profile!
        </h2>
        <p className='text-center'>Please contact support.</p>
      </div>
    );
  }

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
        guest={safeGuest.data}
        countrySelector={
          <SelectCountry
            name='nationality'
            id='nationality'
            defaultNationality={{
              country: safeGuest.data.nationality,
              flagSrc: safeGuest.data.countryFlag,
            }}
            countries={countries}
          />
        }
      />
    </div>
  );
}
