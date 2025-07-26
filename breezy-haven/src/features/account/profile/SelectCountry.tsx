import { getCountries } from '@/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';

export default async function SelectCountry({
  defaultCountry,
  name,
  id,
}: {
  defaultCountry: string;
  name: string;
  id: string;
}) {
  const countries = await getCountries();
  const flag =
    countries.find(country => country.name === defaultCountry)?.flag ?? '';

  return (
    <>
      <Select name={name}>
        <SelectTrigger
          id={id}
          defaultValue={`${defaultCountry}%${flag}`}
          className='w-full'
        >
          <SelectValue placeholder='Select country...' />
        </SelectTrigger>
        <SelectContent align='end' className='max-w-[90vw] md:w-3/4'>
          {countries.map(country => (
            <SelectItem
              key={country.name}
              value={`${country.name}%${country.flag}`}
            >
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
