import { configureStore } from "@reduxjs/toolkit";
import portalReducer from "../features/portal/portalSlice";

const store = configureStore({
  reducer: {
    portal: portalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
