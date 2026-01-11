import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import userService from "./userService";
import { User } from "../../definitions";

type UserState = {
  user: User | null;
  userDetail: User | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  message: string;
  hasCheckedAuth: boolean;
};

const initialState: UserState = {
  user: null,
  userDetail: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  hasCheckedAuth: false,
};

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/getCurrentUser", async (_, thunkAPI) => {
  try {
    const data = await userService.getCurrentUser();
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch user"
    );
  }
});

export const getUserProfile = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("user/getUserProfile", async (userId, thunkAPI) => {
  try {
    const data = await userService.getUserProfile(userId);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch user"
    );
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
      state.hasCheckedAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.message = "";
          state.user = action.payload;
          state.hasCheckedAuth = true;
        }
      )
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
        state.hasCheckedAuth = true;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.message = "";
          state.userDetail = action.payload;
        }
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
