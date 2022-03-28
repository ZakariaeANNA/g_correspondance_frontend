import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state/authSlice";
import { authApi } from "./api/authApi";
import { exportationApi } from "./api/exportationApi";
import { importationApi } from "./api/importationApi";
import { setupListeners } from '@reduxjs/toolkit/query'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [exportationApi.reducerPath]: exportationApi.reducer,
    [importationApi.reducerPath]: importationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(authApi.middleware,exportationApi.middleware,importationApi.middleware),
});

setupListeners(store.dispatch);
