import { getCountries } from '@/lib';

export async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
}: {
  defaultCountry: string;
  name: string;
  id: string;
  className: string;
}) {
  const countries = await getCountries();
  const flag =
    countries.find(country => country.name === defaultCountry)?.flag ?? '';

  return (
    <select
      id={id}
      name={name}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value=''>Select country...</option>
      {countries.map(country => (
        <option key={country.name} value={`${country.name}%${country.flag}`}>
          {country.name}
        </option>
      ))}
    </select>
  );
}
