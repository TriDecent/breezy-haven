import z from 'zod';

export async function getCountries(): Promise<Response> {
  try {
    const res = await fetch(
      'https://restcountries.com/v2/all?fields=name,flag',
      {
        next: { revalidate: 2592000, tags: ['Countries'] },
      }
    );

    const raw = await res.json();

    const validCountries: Country[] = [];
    if (!(raw instanceof Array))
      return {
        data: null,
        error: 'CORRUPTED_DATA',
      };

    raw.map(item => {
      const parsedCountry = SafeCountrySchema.safeParse(item);

      if (!parsedCountry.success) return;

      validCountries.push(parsedCountry.data);
    });

    if (validCountries.length === 0 && raw.length > 0)
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
