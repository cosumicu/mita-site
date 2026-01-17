import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import analyticsService from "./analyticsService";
import type {
  HostCalendarEvent,
  HostDashboardResponse,
  DashboardRange,
} from "../../definitions";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
};

type AnalyticsState = {
  hostCalendarData: AsyncState<HostCalendarEvent[]>;
  hostDashboard: AsyncState<HostDashboardResponse | null>;
  hostDashboardRange: DashboardRange;
};

const initialAsyncState = <T>(data: T): AsyncState<T> => ({
  data,
  loading: false,
  success: false,
  error: false,
  message: "",
});

const initialState: AnalyticsState = {
  hostCalendarData: initialAsyncState<HostCalendarEvent[]>([]),

  hostDashboard: initialAsyncState<HostDashboardResponse | null>(null),
  hostDashboardRange: "month",
};

export const getHostCalendarData = createAsyncThunk<
  HostCalendarEvent[],
  { start: string; end: string },
  { rejectValue: string }
>("analytics/getHostCalendarData", async ({ start, end }, thunkAPI) => {
  try {
    return await analyticsService.getHostCalendarData(start, end);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getHostDashboard = createAsyncThunk<
  HostDashboardResponse,
  { range?: DashboardRange },
  { rejectValue: string }
>("analytics/getHostDashboard", async ({ range = "month" }, thunkAPI) => {
  try {
    return await analyticsService.getHostDashboard(range);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    resetHostCalendarData: (state) => {
      state.hostCalendarData = initialAsyncState<HostCalendarEvent[]>([]);
    },

    setHostDashboardRange: (state, action: PayloadAction<DashboardRange>) => {
      state.hostDashboardRange = action.payload;
    },

    resetHostDashboard: (state) => {
      state.hostDashboard = initialAsyncState<HostDashboardResponse | null>(
        null
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // CALENDAR
      .addCase(getHostCalendarData.pending, (state) => {
        state.hostCalendarData.loading = true;
        state.hostCalendarData.error = false;
        state.hostCalendarData.success = false;
        state.hostCalendarData.message = "";
      })
      .addCase(
        getHostCalendarData.fulfilled,
        (state, action: PayloadAction<HostCalendarEvent[]>) => {
          state.hostCalendarData.loading = false;
          state.hostCalendarData.success = true;
          state.hostCalendarData.data = action.payload;
        }
      )
      .addCase(getHostCalendarData.rejected, (state, action) => {
        state.hostCalendarData.loading = false;
        state.hostCalendarData.error = true;
        state.hostCalendarData.message = action.payload as string;
      })

      // DASHBOARD
      .addCase(getHostDashboard.pending, (state) => {
        state.hostDashboard.loading = true;
        state.hostDashboard.error = false;
        state.hostDashboard.success = false;
        state.hostDashboard.message = "";
      })
      .addCase(
        getHostDashboard.fulfilled,
        (state, action: PayloadAction<HostDashboardResponse>) => {
          state.hostDashboard.loading = false;
          state.hostDashboard.success = true;
          state.hostDashboard.data = action.payload;
        }
      )
      .addCase(getHostDashboard.rejected, (state, action) => {
        state.hostDashboard.loading = false;
        state.hostDashboard.error = true;
        state.hostDashboard.message = action.payload as string;
      });
  },
});

export const {
  resetHostCalendarData,
  setHostDashboardRange,
  resetHostDashboard,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
