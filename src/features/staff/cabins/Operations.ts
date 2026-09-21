import z from 'zod';

export const QuerySchema = z.literal(['all', 'with-discount', 'no-discount']);

export type Query = z.infer<typeof QuerySchema>;

export const Operations: readonly [query: Query, title: string][] = [
  ['all', 'All'],
  ['with-discount', 'With discount'],
  ['no-discount', 'No discount'],
];
