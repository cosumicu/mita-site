import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/users/userSlice";
import propertyReducer from "./features/properties/propertySlice";
import messageReducer from "./features/messages/messageSlice";
import analyticsReducer from "./features/analytics/analyticsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      property: propertyReducer,
      message: messageReducer,
      analytics: analyticsReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
