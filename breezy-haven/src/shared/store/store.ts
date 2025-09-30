import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authApi from './auth-api';
import { cabinFormSlice } from './cabin-form-slice';
import uiSlice from './ui-slice';

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
