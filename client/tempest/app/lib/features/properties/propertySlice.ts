import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import propertyService from "./propertyService";
import {
  Property,
  Reservation,
  Paginated,
  PropertyFilterParams,
  PaginationParams,
  PropertyTag,
  Review,
  ReservationFilterParams,
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
  reservationDetail: AsyncState<Reservation | null>;
  reservationPropertyList: AsyncState<Reservation[]>;
  propertyTagList: AsyncState<PropertyTag[]>;

  // PAGINATED LIST
  propertyList: PaginatedAsyncState<Property>;
  propertyList1: PaginatedAsyncState<Property>;
  propertyList2: PaginatedAsyncState<Property>;
  propertyList3: PaginatedAsyncState<Property>;
  userPropertyList: PaginatedAsyncState<Property>;
  reservationList: PaginatedAsyncState<Reservation>;
  likedList: AsyncState<Property[]>;
  reservationRequestsList: PaginatedAsyncState<Reservation>;
  hostReservationList: PaginatedAsyncState<Reservation>;
  hostReservationPropertyList: PaginatedAsyncState<Reservation>;
  propertyReviews: PaginatedAsyncState<Review>;

  // POST
  createProperty: AsyncState<Property | null>;
  createReservation: AsyncState<Reservation | null>;
  approveReservation: AsyncState<Reservation | null>;
  declineReservation: AsyncState<Reservation | null>;
  createPropertyReview: AsyncState<Review | null>;

  // UPDATE & DELETE
  updateProperty: AsyncState<Property | null>;
  deleteProperty: AsyncState<Property | null>;
  updatePropertyStatus: AsyncState<{
    propertyId: string;
    status: string;
  } | null>;
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
  propertyList1: initialPaginatedAsyncState(),
  propertyList2: initialPaginatedAsyncState(),
  propertyList3: initialPaginatedAsyncState(),
  userPropertyList: initialPaginatedAsyncState(),
  reservationList: initialPaginatedAsyncState(),
  reservationPropertyList: initialAsyncState([]),
  propertyDetail: initialAsyncState(null),
  reservationDetail: initialAsyncState(null),
  likedList: initialAsyncState([]),
  reservationRequestsList: initialPaginatedAsyncState(),
  hostReservationList: initialPaginatedAsyncState(),
  hostReservationPropertyList: initialPaginatedAsyncState(),
  propertyTagList: initialAsyncState([]),
  propertyReviews: initialPaginatedAsyncState(),

  createProperty: initialAsyncState(null),
  createReservation: initialAsyncState(null),
  approveReservation: initialAsyncState(null),
  declineReservation: initialAsyncState(null),
  createPropertyReview: initialAsyncState(null),

  updateProperty: initialAsyncState(null),
  deleteProperty: initialAsyncState(null),
  updatePropertyStatus: initialAsyncState(null),
};

export const getPropertyList = createAsyncThunk<
  Paginated<Property>,
  { filters?: PropertyFilterParams; pagination?: PaginationParams } | void,
  { rejectValue: string }
>(
  "property/getPropertyList",
  async ({ filters = {}, pagination = {} } = {}, thunkAPI) => {
    try {
      const response = await propertyService.getPropertyList(
        filters,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getPropertyList1 = createAsyncThunk<
  Paginated<Property>,
  { filters?: PropertyFilterParams; pagination?: PaginationParams } | void,
  { rejectValue: string }
>(
  "property/getPropertyList1",
  async ({ filters = {}, pagination = {} } = {}, thunkAPI) => {
    try {
      const response = await propertyService.getPropertyList1(
        filters,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getPropertyList2 = createAsyncThunk<
  Paginated<Property>,
  { filters?: PropertyFilterParams; pagination?: PaginationParams } | void,
  { rejectValue: string }
>(
  "property/getPropertyList2",
  async ({ filters = {}, pagination = {} } = {}, thunkAPI) => {
    try {
      const response = await propertyService.getPropertyList2(
        filters,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getPropertyList3 = createAsyncThunk<
  Paginated<Property>,
  { filters?: PropertyFilterParams; pagination?: PaginationParams } | void,
  { rejectValue: string }
>(
  "property/getPropertyList3",
  async ({ filters = {}, pagination = {} } = {}, thunkAPI) => {
    try {
      const response = await propertyService.getPropertyList3(
        filters,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getUserPropertyList = createAsyncThunk<
  Paginated<Property>,
  { filters: PropertyFilterParams; pagination: PaginationParams },
  { rejectValue: string }
>(
  "property/getUserPropertyList",
  async ({ filters = {}, pagination = {} }, thunkAPI) => {
    try {
      const response = await propertyService.getUserPropertyList(
        filters,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createProperty = createAsyncThunk<
  Property,
  FormData,
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

export const getReservationDetail = createAsyncThunk<
  Reservation,
  string,
  { rejectValue: string }
>("property/getReservationDetail", async (reservationId, thunkAPI) => {
  try {
    const response = await propertyService.getReservationDetail(reservationId);
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
  { propertyId: string; formData: FormData },
  { rejectValue: string }
>("property/updateProperty", async ({ propertyId, formData }, thunkAPI) => {
  try {
    const response = await propertyService.updateProperty(propertyId, formData);
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
  { filters: ReservationFilterParams; pagination: PaginationParams },
  { rejectValue: string }
>(
  "property/getReservationList",
  async ({ filters = {}, pagination = {} }, thunkAPI) => {
    try {
      const response = await propertyService.getReservationList(
        filters,
        pagination
      );
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "An error has occured.");
    }
  }
);

export const getReservationPropertyList = createAsyncThunk<
  Reservation[],
  string,
  { rejectValue: string }
>("property/getReservationPropertyList", async (propertyId, thunkAPI) => {
  try {
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

export const getPropertyTags = createAsyncThunk<
  PropertyTag[],
  void,
  { rejectValue: string }
>("property/getPropertyTags", async (_, thunkAPI) => {
  try {
    const response = await propertyService.getPropertyTags();
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getPropertyReviews = createAsyncThunk<
  Paginated<Review>,
  { propertyId: string; pagination: PaginationParams },
  { rejectValue: string }
>(
  "property/getPropertyReviews",
  async ({ propertyId, pagination }, thunkAPI) => {
    try {
      const response = await propertyService.getPropertyReviews(
        propertyId,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createPropertyReview = createAsyncThunk<
  void,
  { propertyId: string; formData: FormData },
  { rejectValue: string }
>(
  "property/createPropertyReview",
  async ({ propertyId, formData }, thunkAPI) => {
    try {
      const response = await propertyService.createPropertyReview(
        propertyId,
        formData
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getHostReservationList = createAsyncThunk<
  Paginated<Reservation>,
  { filters?: ReservationFilterParams; pagination?: PaginationParams },
  { rejectValue: string }
>(
  "property/getHostReservationList",
  async ({ filters = {}, pagination = {} }, thunkAPI) => {
    try {
      const response = await propertyService.getHostReservationList(
        filters,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getHostReservationPropertyList = createAsyncThunk<
  Paginated<Reservation>,
  { propertyId: string; pagination: PaginationParams },
  { rejectValue: string }
>(
  "property/getHostReservationPropertyList",
  async ({ propertyId, pagination }, thunkAPI) => {
    try {
      const response = await propertyService.getHostReservationPropertyList(
        propertyId,
        pagination
      );
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

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

export const updatePropertyStatus = createAsyncThunk<
  { propertyId: string; status: string },
  { propertyId: string; status: string },
  { rejectValue: string }
>("property/updatePropertyStatus", async ({ propertyId, status }, thunkAPI) => {
  try {
    const data = await propertyService.updatePropertyStatus(propertyId, status);
    return { propertyId, status: data.status };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to update status"
    );
  }
});

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetPropertyList: (state) => {
      state.propertyList = initialPaginatedAsyncState();
    },
    resetPropertyListHome: (state) => {
      state.propertyList1 = initialPaginatedAsyncState();
      state.propertyList2 = initialPaginatedAsyncState();
      state.propertyList3 = initialPaginatedAsyncState();
    },
    resetUserPropertyList: (state) => {
      state.userPropertyList = initialPaginatedAsyncState();
    },
    resetReservationList: (state) => {
      state.reservationList = initialPaginatedAsyncState();
    },
    resetHostReservationList: (state) => {
      state.hostReservationList = initialPaginatedAsyncState();
    },
    resetHostReservationPropertyList: (state) => {
      state.hostReservationPropertyList = initialPaginatedAsyncState();
    },
    resetReservationPropertyList: (state) => {
      state.reservationPropertyList = initialAsyncState([]);
    },
    resetPropertyDetail: (state) => {
      state.propertyDetail = initialAsyncState(null);
    },
    resetReservationDetail: (state) => {
      state.reservationDetail = initialAsyncState(null);
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
    resetReservationRequestActions: (state) => {
      state.approveReservation = initialAsyncState(null);
      state.declineReservation = initialAsyncState(null);
    },
    resetPropertyTagList: (state) => {
      state.propertyTagList = initialAsyncState([]);
    },
    resetPropertyReviews: (state) => {
      state.propertyReviews = initialPaginatedAsyncState();
    },
    resetCreatePropertyReview: (state) => {
      state.createPropertyReview = initialAsyncState(null);
    },
    resetUpdatePropertyStatus: (state) => {
      state.updatePropertyStatus = initialAsyncState(null);
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
      // GET PROPERTY LIST
      .addCase(getPropertyList1.pending, (state) => {
        state.propertyList1.loading = true;
      })
      .addCase(
        getPropertyList1.fulfilled,
        (state, action: PayloadAction<Paginated<Property>>) => {
          state.propertyList1.loading = false;
          state.propertyList1.success = true;
          state.propertyList1.data = action.payload.results;
          state.propertyList1.count = action.payload.count;
          state.propertyList1.next = action.payload.next;
          state.propertyList1.previous = action.payload.previous;
        }
      )
      .addCase(getPropertyList1.rejected, (state, action) => {
        state.propertyList1.loading = false;
        state.propertyList1.error = true;
        state.propertyList1.message = action.payload as string;
      })
      // GET PROPERTY LIST
      .addCase(getPropertyList2.pending, (state) => {
        state.propertyList2.loading = true;
      })
      .addCase(
        getPropertyList2.fulfilled,
        (state, action: PayloadAction<Paginated<Property>>) => {
          state.propertyList2.loading = false;
          state.propertyList2.success = true;
          state.propertyList2.data = action.payload.results;
          state.propertyList2.count = action.payload.count;
          state.propertyList2.next = action.payload.next;
          state.propertyList2.previous = action.payload.previous;
        }
      )
      .addCase(getPropertyList2.rejected, (state, action) => {
        state.propertyList2.loading = false;
        state.propertyList2.error = true;
        state.propertyList2.message = action.payload as string;
      })
      // GET PROPERTY LIST
      .addCase(getPropertyList3.pending, (state) => {
        state.propertyList3.loading = true;
      })
      .addCase(
        getPropertyList3.fulfilled,
        (state, action: PayloadAction<Paginated<Property>>) => {
          state.propertyList3.loading = false;
          state.propertyList3.success = true;
          state.propertyList3.data = action.payload.results;
          state.propertyList3.count = action.payload.count;
          state.propertyList3.next = action.payload.next;
          state.propertyList3.previous = action.payload.previous;
        }
      )
      .addCase(getPropertyList3.rejected, (state, action) => {
        state.propertyList3.loading = false;
        state.propertyList3.error = true;
        state.propertyList3.message = action.payload as string;
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
      // GET RESERVATION DETAIL
      .addCase(getReservationDetail.pending, (state) => {
        state.reservationDetail.loading = true;
      })
      .addCase(
        getReservationDetail.fulfilled,
        (state, action: PayloadAction<Reservation>) => {
          state.reservationDetail.loading = false;
          state.reservationDetail.success = true;
          state.reservationDetail.data = action.payload;
        }
      )
      .addCase(getReservationDetail.rejected, (state, action) => {
        state.reservationDetail.loading = false;
        state.reservationDetail.error = true;
        state.reservationDetail.message = action.payload as string;
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
      // GET HOST RESERVATION LIST
      .addCase(getHostReservationList.pending, (state) => {
        state.hostReservationList.loading = true;
      })
      .addCase(
        getHostReservationList.fulfilled,
        (state, action: PayloadAction<Paginated<Reservation>>) => {
          state.hostReservationList.loading = false;
          state.hostReservationList.success = true;
          state.hostReservationList.data = action.payload.results;
          state.hostReservationList.count = action.payload.count;
          state.hostReservationList.next = action.payload.next;
          state.hostReservationList.previous = action.payload.previous;
        }
      )
      .addCase(getHostReservationList.rejected, (state, action) => {
        state.hostReservationList.loading = false;
        state.hostReservationList.error = true;
        state.hostReservationList.message = action.payload as string;
      })
      // GET HOST RESERVATION PROPERTY LIST
      .addCase(getHostReservationPropertyList.pending, (state) => {
        state.hostReservationPropertyList.loading = true;
      })
      .addCase(
        getHostReservationPropertyList.fulfilled,
        (state, action: PayloadAction<Paginated<Reservation>>) => {
          state.hostReservationPropertyList.loading = false;
          state.hostReservationPropertyList.success = true;
          state.hostReservationPropertyList.data = action.payload.results;
          state.hostReservationPropertyList.count = action.payload.count;
          state.hostReservationPropertyList.next = action.payload.next;
          state.hostReservationPropertyList.previous = action.payload.previous;
        }
      )
      .addCase(getHostReservationPropertyList.rejected, (state, action) => {
        state.hostReservationPropertyList.loading = false;
        state.hostReservationPropertyList.error = true;
        state.hostReservationPropertyList.message = action.payload as string;
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
      // APPROVE RESERVATION REQUEST
      .addCase(approveReservation.pending, (state) => {
        state.approveReservation.loading = true;
      })
      .addCase(approveReservation.fulfilled, (state) => {
        state.approveReservation.loading = false;
        state.approveReservation.success = true;
      })
      .addCase(approveReservation.rejected, (state, action) => {
        state.approveReservation.loading = false;
        state.approveReservation.error = true;
        state.approveReservation.message = action.payload as string;
      })
      // DECLINE RESERVATION REQUEST
      .addCase(declineReservation.pending, (state) => {
        state.declineReservation.loading = true;
      })
      .addCase(declineReservation.fulfilled, (state) => {
        state.declineReservation.loading = false;
        state.declineReservation.success = true;
      })
      .addCase(declineReservation.rejected, (state, action) => {
        state.declineReservation.loading = false;
        state.declineReservation.error = true;
        state.declineReservation.message = action.payload as string;
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
      // GET PROPERTY TAGS
      .addCase(getPropertyTags.pending, (state) => {
        state.propertyTagList.loading = true;
      })
      .addCase(
        getPropertyTags.fulfilled,
        (state, action: PayloadAction<PropertyTag[]>) => {
          state.propertyTagList.loading = false;
          state.propertyTagList.success = true;
          state.propertyTagList.data = action.payload;
        }
      )
      .addCase(getPropertyTags.rejected, (state, action) => {
        state.propertyTagList.loading = false;
        state.propertyTagList.error = true;
        state.propertyTagList.message = action.payload as string;
      })
      // GET PROPERTY REVIEWS
      .addCase(getPropertyReviews.pending, (state) => {
        state.propertyReviews.loading = true;
      })
      .addCase(
        getPropertyReviews.fulfilled,
        (state, action: PayloadAction<Paginated<Review>>) => {
          state.propertyReviews.loading = false;
          state.propertyReviews.success = true;
          state.propertyReviews.data = action.payload.results;
          state.propertyReviews.count = action.payload.count;
          state.propertyReviews.next = action.payload.next;
          state.propertyReviews.previous = action.payload.previous;
        }
      )
      .addCase(getPropertyReviews.rejected, (state, action) => {
        state.propertyReviews.loading = false;
        state.propertyReviews.error = true;
        state.propertyReviews.message = action.payload as string;
      })
      // CREATE PROPERTY REVIEW
      .addCase(createPropertyReview.pending, (state) => {
        state.createPropertyReview.loading = true;
      })
      .addCase(
        createPropertyReview.fulfilled,
        (state, action: PayloadAction<void>) => {
          state.createPropertyReview.loading = false;
          state.createPropertyReview.success = true;
        }
      )
      .addCase(createPropertyReview.rejected, (state, action) => {
        state.createPropertyReview.loading = false;
        state.createPropertyReview.error = true;
        state.createPropertyReview.message = action.payload as string;
      })

      // TOGGLE LIKE
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { propertyId } = action.payload;

        const toggleInList = (list?: { data: any[] }) => {
          const p = list?.data.find((x) => x.id === propertyId);
          if (p) p.liked = !p.liked;
        };

        toggleInList(state.propertyList);
        toggleInList(state.propertyList1);
        toggleInList(state.propertyList2);
        toggleInList(state.propertyList3);
        toggleInList(state.userPropertyList);

        if (state.propertyDetail.data?.id === propertyId) {
          state.propertyDetail.data.liked = !state.propertyDetail.data.liked;
        }
        state.propertyList.success = true;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.propertyList.error = true;
        state.propertyList.message = action.payload as string;
      })
      // UPDATE PROPERTY STATUS
      .addCase(updatePropertyStatus.pending, (state) => {
        state.updatePropertyStatus.loading = true;
        state.updatePropertyStatus.error = false;
        state.updatePropertyStatus.success = false;
        state.updatePropertyStatus.message = "";
      })
      .addCase(updatePropertyStatus.fulfilled, (state, action) => {
        state.updatePropertyStatus.loading = false;
        state.updatePropertyStatus.success = true;

        const { propertyId, status } = action.payload;

        const list = state.userPropertyList?.data;
        if (Array.isArray(list)) {
          const item = list.find((p: any) => p.id === propertyId);
          if (item) item.status = status;
        }
      })
      .addCase(updatePropertyStatus.rejected, (state, action) => {
        state.updatePropertyStatus.loading = false;
        state.updatePropertyStatus.error = true;
        state.updatePropertyStatus.message = action.payload as string;
      });
  },
});

export const {
  resetPropertyList,
  resetPropertyListHome,
  resetUserPropertyList,
  resetReservationList,
  resetHostReservationList,
  resetHostReservationPropertyList,
  resetReservationPropertyList,
  resetPropertyDetail,
  resetReservationDetail,
  resetUpdateProperty,
  resetDeleteProperty,
  resetReservationRequestList,
  resetCreateProperty,
  resetCreateReservation,
  resetPropertyTagList,
  resetPropertyReviews,
  resetCreatePropertyReview,
  resetReservationRequestActions,
} = propertySlice.actions;

export default propertySlice.reducer;
