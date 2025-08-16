import {
  GuestFormSchema,
  SelectCountry,
  UpdateProfileForm,
} from '@/features/account/profile';
import { Auth, getCountries } from '@/lib';
import { ROUTES } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = ROUTES.account.nested.profile.metadata;

export default async function Page() {
  const session = await Auth.verifySession();

  const countries = await getCountries();

  const parsedGuest = GuestFormSchema.safeParse(session.main);

  if (!parsedGuest.success) {
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
        guest={parsedGuest.data}
        countrySelector={
          <SelectCountry
            name='nationality'
            id='nationality'
            defaultNationality={{
              country: parsedGuest.data.nationality,
              flagSrc: parsedGuest.data.countryFlag,
            }}
            countries={countries}
          />
        }
      />
    </div>
  );
}
