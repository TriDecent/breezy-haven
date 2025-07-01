import type { UnknownAction } from '@reduxjs/toolkit/react';
import type { Dispatch } from 'react';
import type z from 'zod';
import { uiActions } from '../../shared';
import { billingSchema } from './billingSchema';

export type FormValues = Readonly<
  Record<keyof z.infer<typeof billingSchema>, string>
>;
type FormErrors = Readonly<
  Partial<Record<keyof FormValues, 'string'> & { splittingSubmit: string }>
>;
export interface FormState {
  readonly userEntered: FormValues | null;
  readonly errors: FormErrors | null;
}

export const splittingAction =
  (
    setFormSubmitSuccessState: (state: boolean) => void,
    dispatch: Dispatch<UnknownAction>,
    didTheBillSplitted: boolean,
    splittingPersonId: string
  ) =>
  (_state: FormState, formData: FormData): FormState => {
    const userEntered = Object.fromEntries(formData) as unknown as FormValues;

    if (didTheBillSplitted) {
      return {
        userEntered: null,
        errors: { splittingSubmit: 'You two have already splitted the bill' },
      };
    }

    const result = billingSchema.safeParse(userEntered);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.errors.map(error => [error.path[0], error.message])
      ) as FormErrors;

      return {
        userEntered,
        errors,
      };
    }

    const gap = result.data.myExpense - result.data.friendExpense;

    if (gap > 0) {
      dispatch(
        uiActions.setDebtsOwnedToMe({
          personId: splittingPersonId,
          amount: result.data.billValue - result.data.friendExpense,
        })
      );
    } else if (gap < 0) {
      dispatch(
        uiActions.setDebtsIOwe({
          personId: splittingPersonId,
          amount: result.data.billValue - result.data.myExpense,
        })
      );
    }

    setFormSubmitSuccessState(true);

    return {
      userEntered: null,
      errors: null,
    };
  };
