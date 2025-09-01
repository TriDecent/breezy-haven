'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, type ReactNode } from 'react';
import type {
  ActionResponse,
  SafeAddCabinInput,
  SafeUpdateCabinInput,
} from './actions/types';

interface FormContext<T extends SafeAddCabinInput | SafeUpdateCabinInput> {
  action(
    currentState: ActionResponse<T>,
    formData: FormData
  ): Promise<ActionResponse<T>>;
}

export const CabinFormContext = createContext<
  FormContext<SafeAddCabinInput | SafeUpdateCabinInput>
>({
  action(
    _currentState: ActionResponse<SafeAddCabinInput | SafeUpdateCabinInput>,
    _formData: FormData
  ): Promise<ActionResponse<SafeAddCabinInput | SafeUpdateCabinInput>> {
    throw new Error('Function not implemented.');
  },
});

export function CabinFormProvider<
  T extends SafeAddCabinInput | SafeUpdateCabinInput,
>({
  defaultContext,
  children,
}: {
  defaultContext: FormContext<T>;
  children: ReactNode;
}) {
  return <CabinFormContext value={defaultContext}>{children}</CabinFormContext>;
}
