import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authApi from './authApi';
import { cabinFormSlice } from './cabinFormSlice';
import uiSlice from './uiSlice';

const store = configureStore({
  reducer: {
    [uiSlice.name]: uiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cabinFormSlice.name]: cabinFormSlice.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export default store;
