import z from 'zod';

export const RefreshTokenSchema = z.object({
  tokenId: z.string({ error: 'tokenId must be string' }),
  created_at: z.string({ error: 'created_at must be a string' }),
});

export const NullableRefreshTokenSchema = z.object({
  tokenId: z.string({ error: 'tokenId must be string' }).nullable(),
  created_at: z.string({ error: 'created_at must be a string' }).nullable(),
});

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type NullableRefreshToken = z.infer<typeof NullableRefreshTokenSchema>;
