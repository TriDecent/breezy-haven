import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Friend } from './friendSlice';

const initialState: { selectedFriend: Friend | null } = {
  selectedFriend: null,
};
const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    setSelectedFriend: (state, action: PayloadAction<Friend | null>) => {
      state.selectedFriend = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
