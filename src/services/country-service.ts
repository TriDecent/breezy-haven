import z from 'zod';

export async function getCountries(): Promise<Response> {
  try {
    const res = await fetch(
      'https://countries.dev/countries?fields=name%2Cflags%2Cindependent',
      {
        next: { revalidate: 2592000, tags: ['Countries'] },
      }
    );

    const countries = await res.json();
    const mappedCountries = countries.map(
      (item: { flags: { svg: string } }) => ({
        ...item,
        flag: item.flags.svg,
      })
    );

    const validCountries: Country[] = [];
    if (!(mappedCountries instanceof Array)) {
      console.log('why then?');
      return {
        data: null,
        error: 'CORRUPTED_DATA',
      };
    }

    mappedCountries.map(item => {
      const parsedCountry = SafeCountrySchema.safeParse(item);

      if (!parsedCountry.success) return;

      validCountries.push(parsedCountry.data);
    });

    if (validCountries.length === 0 && mappedCountries.length > 0)
      return {
        data: null,
        error: 'CORRUPTED_DATA',
      };

    return {
      data: validCountries,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'UNEXPECTED_ERROR',
    };
  }
}

type Response = Readonly<
  | {
      data: readonly Country[];
      error: null;
    }
  | {
      data: null;
      error: 'CORRUPTED_DATA' | 'UNEXPECTED_ERROR';
    }
>;

export const SafeCountrySchema = z
  .object({
    name: z.string({ error: 'Country name must be string' }),
    flag: z.url({ error: 'Flag must be url' }),
    independent: z.coerce.boolean({
      error: 'Independent status must be boolean',
    }),
  })
  .readonly();

export type Country = z.infer<typeof SafeCountrySchema>;
