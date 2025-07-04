import z from 'zod';

export const billingShape = {
  billValue: z.coerce
    .number({ message: 'Bill value must be number' })
    .min(0, { message: 'Bill value must be at least 0' }),
  myExpense: z.coerce
    .number({ message: 'Your expense value must be number' })
    .min(0, { message: 'Your expense value must be at least 0' }),
  friendExpense: z.coerce
    .number({ message: "Your friend's expense value must be number" })
    .min(0, { message: "Your friend's expense value must be at least 0" }),
  payer: z.string().refine(payer => payer === 'me' || payer === 'friend', {
    message: 'Payer must be you or your friend',
  }),
};

export const billingSchema = z
  .object(billingShape)
  .refine(data => data.friendExpense <= data.billValue, {
    message: 'Your friend paid much more than the bill value',
    path: ['friendExpense'],
  })
  .refine(data => data.myExpense <= data.billValue, {
    message: 'You paid much more than the bill value',
    path: ['myExpense'],
  });
