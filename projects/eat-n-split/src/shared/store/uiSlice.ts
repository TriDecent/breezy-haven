import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Friend } from './friendSlice';

interface Debt {
  readonly personId: string;
  readonly amount: number;
  readonly hasTheDebtBeenApproved: boolean;
}

const initialState: {
  selectedFriend: Friend | null;
  debtsIOwe: readonly Debt[];
  debtsOwedToMe: readonly Debt[];
} = {
  selectedFriend: null,
  debtsIOwe: [],
  debtsOwedToMe: [],
};
const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    setSelectedFriend: (state, action: PayloadAction<Friend | null>) => {
      state.selectedFriend = action.payload;
    },
    setDebtsIOwe: (
      state,
      action: PayloadAction<Omit<Debt, 'hasTheDebtBeenApproved'>>
    ) => {
      state.debtsIOwe.push({ ...action.payload, hasTheDebtBeenApproved: true });
    
    },
    setDebtsOwnedToMe: (
      state,
      action: PayloadAction<Omit<Debt, 'hasTheDebtBeenApproved'>>
    ) => {
      state.debtsOwedToMe.push({
        ...action.payload,
        hasTheDebtBeenApproved: true,
      });
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
