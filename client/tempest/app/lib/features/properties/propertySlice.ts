import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import propertyService from "./propertyService";
import {
  Property,
  Reservation,
  Paginated,
  PropertyFilterParams,
  PaginationParams,
} from "../../definitions";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
};

type PaginatedAsyncState<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  data: T[];

  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
};

type PropertyState = {
  // GET
  propertyDetail: AsyncState<Property | null>;
  reservationPropertyList: AsyncState<Reservation[]>;

  // PAGINATED LIST
  propertyList: PaginatedAsyncState<Property>;
  userPropertyList: PaginatedAsyncState<Property>;
  reservationList: PaginatedAsyncState<Reservation>;
  likedList: AsyncState<Property[]>;
  reservationRequestsList: PaginatedAsyncState<Reservation>;

  // POST
  createProperty: AsyncState<Property | null>;
  createReservation: AsyncState<Reservation | null>;
  approveReservation: AsyncState<Reservation | null>;
  declineReservation: AsyncState<Reservation | null>;

  // UPDATE & DELETE
  updateProperty: AsyncState<Property | null>;
  deleteProperty: AsyncState<Property | null>;
};

const initialAsyncState = <T>(data: T): AsyncState<T> => ({
  data,
  loading: false,
  success: false,
  error: false,
  message: "",
});

const initialPaginatedAsyncState = <T>(): PaginatedAsyncState<T> => ({
  count: 0,
  next: null,
  previous: null,
  data: [],

  loading: false,
  success: false,
  error: false,
  message: "",
});

const initialState: PropertyState = {
  propertyList: initialPaginatedAsyncState(),
  userPropertyList: initialPaginatedAsyncState(),
  reservationList: initialPaginatedAsyncState(),
  reservationPropertyList: initialAsyncState([]),
  propertyDetail: initialAsyncState(null),
  likedList: initialAsyncState([]),
  reservationRequestsList: initialPaginatedAsyncState(),

  createProperty: initialAsyncState(null),
  createReservation: initialAsyncState(null),
  approveReservation: initialAsyncState(null),
  declineReservation: initialAsyncState(null),

  updateProperty: initialAsyncState(null),
  deleteProperty: initialAsyncState(null),
};

export const getPropertyList = createAsyncThunk<
  Paginated<Property>, // returns
  { filters: PropertyFilterParams; pagination: PaginationParams }, // accepts
  { rejectValue: string } // reject with value
>("property/getPropertyList", async ({ filters, pagination }, thunkAPI) => {
  try {
    const response = await propertyService.getPropertyList(filters, pagination);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getUserPropertyList = createAsyncThunk<
  Paginated<Property>,
  { userId: string; pagination: PaginationParams },
  { rejectValue: string }
>("property/getUserPropertyList", async ({ userId, pagination }, thunkAPI) => {
  try {
    const response = await propertyService.getUserPropertyList(
      userId,
      pagination
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const createProperty = createAsyncThunk<
  Property,
  Property,
  { rejectValue: string }
>("property/createProperty", async (formData, thunkAPI) => {
  try {
    const response = await propertyService.createProperty(formData);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getPropertyDetail = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("property/getPropertyDetail", async (propertyId, thunkAPI) => {
  try {
    const response = await propertyService.getPropertyDetail(propertyId);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const updateProperty = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("property/updateProperty", async (propertyId, thunkAPI) => {
  try {
    const response = await propertyService.updateProperty(propertyId);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const deleteProperty = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("property/deleteProperty", async (propertyId, thunkAPI) => {
  try {
    const response = await propertyService.deleteProperty(propertyId);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const createReservation = createAsyncThunk<
  Reservation,
  Reservation,
  { rejectValue: string }
>("property/createReservation", async (formData, thunkAPI) => {
  try {
    const response = await propertyService.createReservation(formData);
    thunkAPI.dispatch(getReservationPropertyList(formData.property_id));
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getReservationList = createAsyncThunk<
  Paginated<Reservation>,
  PaginationParams,
  { rejectValue: string }
>("property/getReservationList", async (pagination, thunkAPI) => {
  try {
    const response = await propertyService.getReservationList(pagination);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "An error has occured.");
  }
});

export const getReservationPropertyList = createAsyncThunk<
  Reservation[],
  string,
  { rejectValue: string }
>("property/getReservationPropertyList", async (propertyId, thunkAPI) => {
  try {
    console.log("workingasdasdasd");
    const response = await propertyService.getReservationPropertyList(
      propertyId
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getReservationRequestsList = createAsyncThunk<
  Paginated<Reservation>, // return type
  { page?: number; pageSize?: number }, // argument type
  { rejectValue: string }
>(
  "property/getReservationRequestsList",
  async ({ page = 1, pageSize = 10 }, thunkAPI) => {
    try {
      const response = await propertyService.getReservationRequestsList({
        page,
        pageSize,
      });
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch reservations"
      );
    }
  }
);

export const approveReservation = createAsyncThunk<
  { reservationId: string }, // return type
  string, // argument type
  { rejectValue: string } // reject type
>("property/approveReservation", async (reservationId, thunkAPI) => {
  try {
    await propertyService.approveReservation(reservationId);
    return { reservationId }; // return payload on success
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const declineReservation = createAsyncThunk<
  { reservationId: string }, // return type
  string, // argument type
  { rejectValue: string } // reject type
>("property/declineReservation", async (reservationId, thunkAPI) => {
  try {
    await propertyService.declineReservation(reservationId);
    return { reservationId }; // return payload on success
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getUserLikesList = createAsyncThunk<
  Property[],
  void,
  { rejectValue: string }
>("property/getUserLikesList", async (_, thunkAPI) => {
  try {
    const response = await propertyService.getUserLikesList();
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const toggleFavorite = createAsyncThunk<
  { propertyId: string },
  string,
  { rejectValue: string }
>("property/toggleFavorite", async (propertyId, thunkAPI) => {
  try {
    await propertyService.toggleFavorite(propertyId);
    // return the ID so the reducer knows which property to flip
    return { propertyId };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// propertyList: initialAsyncState([]),
// userPropertyList: initialAsyncState([]),
// reservationList: initialAsyncState([]),
// reservationPropertyList: initialAsyncState([]),
// propertyDetail: initialAsyncState(null),

// createProperty: initialAsyncState(null),
// createReservation: initialAsyncState(null)

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetPropertyList: (state) => {
      state.propertyList = initialPaginatedAsyncState();
    },
    resetUserPropertyList: (state) => {
      state.userPropertyList = initialPaginatedAsyncState();
    },
    resetReservationList: (state) => {
      state.reservationList = initialPaginatedAsyncState();
    },
    resetReservationPropertyList: (state) => {
      state.reservationPropertyList = initialAsyncState([]);
    },
    resetPropertyDetail: (state) => {
      state.propertyDetail = initialAsyncState(null);
    },
    resetCreateProperty: (state) => {
      state.createProperty = initialAsyncState(null);
    },
    resetCreateReservation: (state) => {
      state.createReservation = initialAsyncState(null);
    },
    resetUpdateProperty: (state) => {
      state.updateProperty = initialAsyncState(null);
    },
    resetDeleteProperty: (state) => {
      state.deleteProperty = initialAsyncState(null);
    },
    resetReservationRequestList: (state) => {
      state.deleteProperty = initialAsyncState(null);
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROPERTY LIST
      .addCase(getPropertyList.pending, (state) => {
        state.propertyList.loading = true;
      })
      .addCase(
        getPropertyList.fulfilled,
        (state, action: PayloadAction<Paginated<Property>>) => {
          state.propertyList.loading = false;
          state.propertyList.success = true;
          state.propertyList.data = action.payload.results;
          state.propertyList.count = action.payload.count;
          state.propertyList.next = action.payload.next;
          state.propertyList.previous = action.payload.previous;
        }
      )
      .addCase(getPropertyList.rejected, (state, action) => {
        state.propertyList.loading = false;
        state.propertyList.error = true;
        state.propertyList.message = action.payload as string;
      })
      // GET USER PROPERTY LIST
      .addCase(getUserPropertyList.pending, (state) => {
        state.userPropertyList.loading = true;
      })
      .addCase(
        getUserPropertyList.fulfilled,
        (state, action: PayloadAction<Paginated<Property>>) => {
          state.userPropertyList.loading = false;
          state.userPropertyList.success = true;
          state.userPropertyList.data = action.payload.results;
          state.userPropertyList.count = action.payload.count;
          state.userPropertyList.next = action.payload.next;
          state.userPropertyList.previous = action.payload.previous;
        }
      )
      .addCase(getUserPropertyList.rejected, (state, action) => {
        state.userPropertyList.loading = false;
        state.userPropertyList.error = true;
        state.userPropertyList.message = action.payload as string;
      })
      // CREATE PROPERTY
      .addCase(createProperty.pending, (state) => {
        state.createProperty.loading = true;
      })
      .addCase(
        createProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.createProperty.loading = false;
          state.createProperty.success = true;
          state.createProperty.data = action.payload;
        }
      )
      .addCase(createProperty.rejected, (state, action) => {
        state.createProperty.loading = false;
        state.createProperty.error = true;
        state.createProperty.message = action.payload as string;
      })
      // GET PROPERTY DETAIL
      .addCase(getPropertyDetail.pending, (state) => {
        state.propertyDetail.loading = true;
      })
      .addCase(
        getPropertyDetail.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.propertyDetail.loading = false;
          state.propertyDetail.success = true;
          state.propertyDetail.data = action.payload;
        }
      )
      .addCase(getPropertyDetail.rejected, (state, action) => {
        state.propertyDetail.loading = false;
        state.propertyDetail.error = true;
        state.propertyDetail.message = action.payload as string;
      })
      // UPDATE PROPERTY
      .addCase(updateProperty.pending, (state) => {
        state.updateProperty.loading = true;
      })
      .addCase(
        updateProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.updateProperty.loading = false;
          state.updateProperty.success = true;
          state.updateProperty.data = action.payload;
        }
      )
      .addCase(updateProperty.rejected, (state, action) => {
        state.updateProperty.loading = false;
        state.updateProperty.error = true;
        state.updateProperty.message = action.payload as string;
      })
      // DELETE PROPERTY
      .addCase(deleteProperty.pending, (state) => {
        state.deleteProperty.loading = true;
      })
      .addCase(
        deleteProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.deleteProperty.loading = false;
          state.deleteProperty.success = true;
          state.deleteProperty.data = action.payload;
        }
      )
      .addCase(deleteProperty.rejected, (state, action) => {
        state.deleteProperty.loading = false;
        state.deleteProperty.error = true;
        state.deleteProperty.message = action.payload as string;
      })
      // CREATE RESERVATION
      .addCase(createReservation.pending, (state) => {
        state.createReservation.loading = true;
      })
      .addCase(
        createReservation.fulfilled,
        (state, action: PayloadAction<Reservation>) => {
          state.createReservation.loading = false;
          state.createReservation.success = true;
          state.createReservation.data = action.payload;
        }
      )
      .addCase(createReservation.rejected, (state, action) => {
        state.createReservation.loading = false;
        state.createReservation.error = true;
        state.createReservation.message = action.payload as string;
      })
      // GET RESERVATION LIST
      // GET RESERVATION LIST
      .addCase(getReservationList.pending, (state) => {
        state.reservationList.loading = true;
      })
      .addCase(
        getReservationList.fulfilled,
        (state, action: PayloadAction<Paginated<Reservation>>) => {
          state.reservationList.loading = false;
          state.reservationList.success = true;
          state.reservationList.data = action.payload.results;
          state.reservationList.count = action.payload.count;
          state.reservationList.next = action.payload.next;
          state.reservationList.previous = action.payload.previous;
        }
      )
      .addCase(getReservationList.rejected, (state, action) => {
        state.reservationList.loading = false;
        state.reservationList.error = true;
        state.reservationList.message = action.payload as string;
      })

      // GET RESERVATION PROPERTY LIST
      .addCase(getReservationPropertyList.pending, (state) => {
        state.reservationPropertyList.loading = true;
      })
      .addCase(
        getReservationPropertyList.fulfilled,
        (state, action: PayloadAction<Reservation[]>) => {
          state.reservationPropertyList.loading = false;
          state.reservationPropertyList.success = true;
          state.reservationPropertyList.data = action.payload;
        }
      )
      .addCase(getReservationPropertyList.rejected, (state, action) => {
        state.reservationPropertyList.loading = false;
        state.reservationPropertyList.error = true;
        state.reservationPropertyList.message = action.payload as string;
      })
      // GET RESERVATION REQUEST LIST
      .addCase(getReservationRequestsList.pending, (state) => {
        state.reservationRequestsList.loading = true;
      })
      .addCase(
        getReservationRequestsList.fulfilled,
        (state, action: PayloadAction<Paginated<Reservation>>) => {
          state.reservationRequestsList.loading = false;
          state.reservationRequestsList.success = true;
          state.reservationRequestsList.data = action.payload.results;
          state.reservationRequestsList.count = action.payload.count;
          state.reservationRequestsList.next = action.payload.next;
          state.reservationRequestsList.previous = action.payload.previous;
        }
      )
      .addCase(getReservationRequestsList.rejected, (state, action) => {
        state.reservationRequestsList.loading = false;
        state.reservationRequestsList.error = true;
        state.reservationRequestsList.message = action.payload as string;
      })
      // GET USER FAVORITES
      .addCase(getUserLikesList.pending, (state) => {
        state.likedList.loading = true;
      })
      .addCase(
        getUserLikesList.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.likedList.loading = false;
          state.likedList.success = true;
          state.likedList.data = action.payload;
        }
      )
      .addCase(getUserLikesList.rejected, (state, action) => {
        state.likedList.loading = false;
        state.likedList.error = true;
        state.likedList.message = action.payload as string;
      })
      // TOGGLE LIKE
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { propertyId } = action.payload;

        const property = state.propertyList.data.find(
          (p) => p.id === propertyId
        );
        if (property) property.liked = !property.liked;

        const userProperty = state.userPropertyList.data.find(
          (p) => p.id === propertyId
        );
        if (userProperty) userProperty.liked = !userProperty.liked;

        if (state.propertyDetail.data?.id === propertyId) {
          state.propertyDetail.data.liked = !state.propertyDetail.data.liked;
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.propertyList.error = true;
        state.propertyList.message = action.payload as string;
      });
  },
});

export const {
  resetPropertyList,
  resetUserPropertyList,
  resetReservationList,
  resetReservationPropertyList,
  resetPropertyDetail,
  resetCreateProperty,
  resetCreateReservation,
} = propertySlice.actions;

export default propertySlice.reducer;
