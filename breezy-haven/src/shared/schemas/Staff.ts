import z from 'zod';

export const StaffSchema = z.object({
  id: z.coerce.number({ error: 'id must be number' }),
  created_at: z.string({ error: 'created_at must be a string' }),
  email: z.email({ error: 'email must be a valid email' }),
  avatarUrl: z.url({ error: 'Avatar must be a valid url' }),
  hash_password: z.string({ error: 'hash_password must be string' }),
});

export const NullableStaffSchema = z.object({
  id: z.coerce.number({ error: 'id must be number' }).nullable(),
  created_at: z.string({ error: 'created_at must be a string' }).nullable(),
  email: z.email({ error: 'email must be a valid email' }).nullable(),
  avatarUrl: z.url({ error: 'Avatar must be a valid url' }).nullable(),
  hash_password: z.string({ error: 'hash_password must be string' }).nullable(),
});

export type Staff = z.infer<typeof StaffSchema>;
export type NullableStaff = z.infer<typeof NullableStaffSchema>;
