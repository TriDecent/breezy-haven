import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Friend } from './friendSlice';

const initialState: {
  selectedFriend: Friend | null;
  debtsIOwe: number;
  debtsOwedToMe: number;
  didTheBillSplitted: boolean;
} = {
  selectedFriend: null,
  debtsIOwe: 0,
  debtsOwedToMe: 0,
  didTheBillSplitted: false,
};
const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    setSelectedFriend: (state, action: PayloadAction<Friend | null>) => {
      state.selectedFriend = action.payload;
      state.debtsIOwe = 0;
      state.debtsOwedToMe = 0;
      state.didTheBillSplitted = false;
    },
    setDebtsIOwe: (state, action: PayloadAction<number>) => {
      state.debtsIOwe = action.payload;
      state.didTheBillSplitted = true;
    },
    setDebtsOwnedToMe: (state, action: PayloadAction<number>) => {
      state.debtsOwedToMe = action.payload;
      state.didTheBillSplitted = true;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
