import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import messageService from "./messageService";
import { Conversation, Message } from "../../definitions";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
};

const initialAsyncState = <T>(data: T): AsyncState<T> => ({
  data,
  loading: false,
  success: false,
  error: false,
  message: "",
});

type MessageState = {
  conversationList: AsyncState<Conversation[]>;
  messageList: AsyncState<Message[]>;
  createMessage: AsyncState<Message | null>;
};

const initialState: MessageState = {
  conversationList: initialAsyncState([]),
  messageList: initialAsyncState([]),
  createMessage: initialAsyncState(null),
};

// ────────────────────────────────
// Async Thunks
// ────────────────────────────────
export const getConversationList = createAsyncThunk<
  Conversation[],
  void,
  { rejectValue: string }
>("message/getConversationList", async (_, thunkAPI) => {
  try {
    return await messageService.getConversationList();
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getConversationMessages = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>("message/getConversationMessages", async (conversationId, thunkAPI) => {
  try {
    return await messageService.getConversationMessages(conversationId);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// export const createMessage = createAsyncThunk<
//   Message,
//   { conversationId: string; text: string },
//   { rejectValue: string }
// >("message/createMessage", async ({ conversationId, text }, thunkAPI) => {
//   try {
//     return await messageService.createMessage(conversationId, text);
//   } catch (err) {
//     const error = err as AxiosError<{ message?: string }>;
//     return thunkAPI.rejectWithValue(
//       error.response?.data?.message || error.message
//     );
//   }
// });

// ────────────────────────────────
// Slice
// ────────────────────────────────
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    resetConversationList: (state) => {
      state.conversationList = initialAsyncState([]);
    },
    resetMessageList: (state) => {
      state.messageList = initialAsyncState([]);
    },
    // resetCreateMessage: (state) => {
    //   state.createMessage = initialAsyncState(null);
    // },
    // addMessage: (state, action: PayloadAction<Message>) => {
    //   state.messageList.data.push(action.payload);
    // },
  },
  extraReducers: (builder) => {
    // Conversation List
    builder
      .addCase(getConversationList.pending, (state) => {
        state.conversationList.loading = true;
      })
      .addCase(
        getConversationList.fulfilled,
        (state, action: PayloadAction<Conversation[]>) => {
          state.conversationList.loading = false;
          state.conversationList.success = true;
          state.conversationList.data = action.payload;
        }
      )
      .addCase(getConversationList.rejected, (state, action) => {
        state.conversationList.loading = false;
        state.conversationList.error = true;
        state.conversationList.message = action.payload as string;
      });

    // Conversation Messages
    builder
      .addCase(getConversationMessages.pending, (state) => {
        state.messageList.loading = true;
      })
      .addCase(
        getConversationMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.messageList.loading = false;
          state.messageList.success = true;
          state.messageList.data = action.payload;
        }
      )
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.messageList.loading = false;
        state.messageList.error = true;
        state.messageList.message = action.payload as string;
      });

    // // Create Message
    // builder
    //   .addCase(createMessage.pending, (state) => {
    //     state.createMessage.loading = true;
    //   })
    //   .addCase(
    //     createMessage.fulfilled,
    //     (state, action: PayloadAction<Message>) => {
    //       state.createMessage.loading = false;
    //       state.createMessage.success = true;
    //       state.createMessage.data = action.payload;
    //     }
    //   )
    //   .addCase(createMessage.rejected, (state, action) => {
    //     state.createMessage.loading = false;
    //     state.createMessage.error = true;
    //     state.createMessage.message = action.payload as string;
    //   });
  },
});

export const {
  resetConversationList,
  resetMessageList,
  // resetCreateMessage,
  // addMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
