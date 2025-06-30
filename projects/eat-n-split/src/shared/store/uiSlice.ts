import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Friend } from './friendSlice';

const initialState: {
  selectedFriend: Friend | null;
  debtsIOwe: number;
  debtsOwedToMe: number;
} = {
  selectedFriend: null,
  debtsIOwe: 0,
  debtsOwedToMe: 0,
};
const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    setSelectedFriend: (state, action: PayloadAction<Friend | null>) => {
      state.selectedFriend = action.payload;
    },
    setDebtsIOwe: (state, action: PayloadAction<number>) => {
      state.debtsIOwe = action.payload;
    },
    setDebtsOwnedToMe: (state, action: PayloadAction<number>) => {
      state.debtsOwedToMe = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
