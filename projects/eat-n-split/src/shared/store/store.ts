import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import friendSlice from './friendSlice';
import uiSlice from './uiSlice';

const store = configureStore({
  reducer: {
    [friendSlice.name]: friendSlice.reducer,
    [uiSlice.name]: uiSlice.reducer,
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;
