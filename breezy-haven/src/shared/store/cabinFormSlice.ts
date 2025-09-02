import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cabin } from '../schemas/Cabin';

interface CabinFormState {
  isOpen: boolean;
  mode: 'add' | 'update' | 'unknown';
  defaultCabin?: Cabin;
}

const initialState: CabinFormState = {
  isOpen: false,
  mode: 'unknown',
};

export const cabinFormSlice = createSlice({
  name: 'cabinForm',
  initialState,
  reducers: {
    openAddForm: state => {
      state.isOpen = true;
      state.mode = 'add';
      state.defaultCabin = undefined;
    },

    openUpdateForm: (state, action: PayloadAction<Cabin>) => {
      state.isOpen = true;
      state.mode = 'update';
      state.defaultCabin = action.payload;
    },

    closeForm: state => {
      state.isOpen = false;
      state.mode = 'unknown';
      state.defaultCabin = undefined;
    },
  },
});

export const cabinFormActions = cabinFormSlice.actions;
