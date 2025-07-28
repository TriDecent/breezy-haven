import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from 'next-auth';

const initialState: { session: Session | null } = { session: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>): void => {
      state.session = action.payload;
    },
    resetSession: (state): void => {
      state.session = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
