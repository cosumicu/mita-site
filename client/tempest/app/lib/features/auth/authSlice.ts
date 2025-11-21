import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import authService from "./authService";
import {
  AuthState,
  RegisterData,
  ActivateData,
  LoginData,
} from "../../definitions";

const initialState: AuthState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const register = createAsyncThunk<
  void,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, thunkAPI) => {
  try {
    await authService.register(userData);
  } catch (err) {
    const error = err as AxiosError<any>;

    // This is a temporary solution for informing user about errors when signing up
    // A toast will show the error sent by the backend password validator

    // Example: { password: ["The password is too similar to the email."] }
    const data = error.response?.data;

    // 1. If Django DRF returns field errors
    if (data && typeof data === "object") {
      // Take the FIRST error message
      const firstKey = Object.keys(data)[0];
      const firstError = data[firstKey][0];
      return thunkAPI.rejectWithValue(firstError);
    }

    // 2. If there’s a `message` field
    return thunkAPI.rejectWithValue(data?.message || error.message);
  }
});

export const activate = createAsyncThunk<
  void,
  ActivateData,
  { rejectValue: string }
>("auth/activate", async (userData, thunkAPI) => {
  try {
    await authService.activate(userData);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const login = createAsyncThunk<void, LoginData, { rejectValue: string }>(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      await authService.login(userData);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logout = createAsyncThunk<void>("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(activate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activate.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
