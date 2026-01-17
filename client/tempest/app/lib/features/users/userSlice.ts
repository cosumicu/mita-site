import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import userService from "./userService";
import { User } from "../../definitions";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
};

type UserState = {
  user: User | null;
  userDetail: AsyncState<User | null>;

  // ✅ NEW: update profile async state
  updateProfile: AsyncState<null>;
  updateHostStatus: AsyncState<null>;

  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  message: string;
  hasCheckedAuth: boolean;
};

const initialAsyncState = <T>(data: T): AsyncState<T> => ({
  data,
  loading: false,
  success: false,
  error: false,
  message: "",
});

const initialState: UserState = {
  user: null,
  userDetail: initialAsyncState<User | null>(null),

  updateProfile: initialAsyncState<null>(null),
  updateHostStatus: initialAsyncState<null>(null),

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
      error.response?.data?.message || error.message || "Failed to fetch user",
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
      error.response?.data?.message || error.message || "Failed to fetch user",
    );
  }
});

export const updateMyProfile = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("user/updateMyProfile", async (formData, thunkAPI) => {
  try {
    const data = await userService.updateMyProfile(formData);
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (typeof error.response?.data === "string"
        ? error.response?.data
        : null) ||
      error.message ||
      "Failed to update profile";
    return thunkAPI.rejectWithValue(msg);
  }
});

export const updateMyHostStatus = createAsyncThunk<
  User,
  { host_status: string },
  { rejectValue: string }
>("user/updateMyHostStatus", async ({ host_status }, thunkAPI) => {
  try {
    const data = await userService.updateMyHostStatus(host_status);
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (typeof error.response?.data === "string"
        ? error.response?.data
        : null) ||
      error.message ||
      "Failed to update host status";
    return thunkAPI.rejectWithValue(msg);
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

      // ✅ reset update state too
      state.updateProfile = initialAsyncState<null>(null);
    },
    // ✅ optional: reset update-only flags
    resetUpdateProfile: (state) => {
      state.updateProfile = initialAsyncState<null>(null);
    },
    resetUpdateHostStatus: (state) => {
      state.updateHostStatus = initialAsyncState<null>(null);
    },
  },
  extraReducers: (builder) => {
    builder
      // getCurrentUser
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
        },
      )
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
        state.hasCheckedAuth = true;
      })

      // getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.userDetail.loading = true;
      })
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.userDetail.loading = false;
          state.userDetail.error = false;
          state.userDetail.success = true;
          state.userDetail.message = "";
          state.userDetail.data = action.payload;
        },
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.userDetail.loading = false;
        state.userDetail.error = true;
        state.userDetail.success = false;
        state.userDetail.message = action.payload as string;
      })

      //  updateMyProfile
      .addCase(updateMyProfile.pending, (state) => {
        state.updateProfile.loading = true;
        state.updateProfile.error = false;
        state.updateProfile.success = false;
        state.updateProfile.message = "";
      })
      .addCase(
        updateMyProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.updateProfile.loading = false;
          state.updateProfile.success = true;
        },
      )
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.updateProfile.loading = false;
        state.updateProfile.error = true;
        state.updateProfile.success = false;
        state.updateProfile.message = action.payload as string;
      }) // updateMyHostStatus
      .addCase(updateMyHostStatus.pending, (state) => {
        state.updateHostStatus.loading = true;
        state.updateHostStatus.error = false;
        state.updateHostStatus.success = false;
        state.updateHostStatus.message = "";
      })
      .addCase(
        updateMyHostStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.updateHostStatus.loading = false;
          state.updateHostStatus.success = true;

          //  update user in store immediately (so routing/guards update)
          if (state.user) {
            // Case 1: your API returns host_status at root
            if (
              "host_status" in state.user &&
              (action.payload as any).host_status
            ) {
              (state.user as any).host_status = (
                action.payload as any
              ).host_status;
            }

            // Case 2: your API nests it: user.profile.host_status
            if (
              (state.user as any).profile &&
              (action.payload as any).profile
            ) {
              (state.user as any).profile.host_status = (
                action.payload as any
              ).profile.host_status;
            }

            // safest: just replace user if the response is the full user object
            // state.user = action.payload;
          }

          // also keep userDetail in sync if you're showing profile page
          if (state.userDetail.data?.user_id === action.payload.user_id) {
            state.userDetail.data = action.payload;
          }
        },
      )
      .addCase(updateMyHostStatus.rejected, (state, action) => {
        state.updateHostStatus.loading = false;
        state.updateHostStatus.error = true;
        state.updateHostStatus.success = false;
        state.updateHostStatus.message = action.payload as string;
      });
  },
});

export const { reset, resetUpdateProfile } = userSlice.actions;
export default userSlice.reducer;
