'use server';
import { staffCabinService } from '@/services';
import { ROUTES } from '@/shared';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { AddCabinSchema } from './types';

const DuplicateCabinSchema = AddCabinSchema.omit({ image: true }).extend({
  image: z.url({ error: 'Image must be url' }),
});
type SafeDuplicateCabinSchema = z.infer<typeof DuplicateCabinSchema>;

export async function duplicateCabinAction(input: SafeDuplicateCabinSchema) {
  // TODO: verify staff authentication
  const parsedResult = DuplicateCabinSchema.safeParse(input);

  if (!parsedResult.success)
    throw new Error('An error has occurred while trying to parse the input!');

  const { errors } = await staffCabinService.create({
    ...parsedResult.data,
    name: `Copy of ${parsedResult.data?.name}`,
  });
  if (errors) throw new Error('Cannot duplicate the cabin!');

  revalidatePath(ROUTES.staff.nested.cabins.href);
  revalidatePath(ROUTES.cabins.href);
}
