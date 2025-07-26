import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import uiSlice from './uiSlice';

const store = configureStore({
  reducer: { [uiSlice.name]: uiSlice.reducer },

  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export default store;
