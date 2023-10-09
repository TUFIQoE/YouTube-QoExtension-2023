import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { api } from './api';

export const store = configureStore({
  reducer: {
    // ...slice reducers here...
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
