import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import { API_ROUTES } from "../../api/apiRoutes";

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ROUTES.GET_ALL_BOOKINGS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        API_ROUTES.UPDATE_BOOKING(id),
        updates
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// 🔍 LOGS ADDED HERE
export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id, { rejectWithValue }) => {
    console.log("3. [Redux Thunk] deleteBooking started for ID:", id);
    try {
      const url = API_ROUTES.DELETE_BOOKING(id);
      console.log("4. [Redux Thunk] Sending DELETE request to:", url);

      const response = await apiClient.delete(url);

      console.log("5. [Redux Thunk] Response received:", response.data);
      return id; // Return ID to remove from state locally
    } catch (error) {
      console.error("❌ [Redux Thunk] Error:", error.response || error.message);
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// ... (sendNotification thunk remains same) ...
export const sendNotification = createAsyncThunk(
  "bookings/sendNotification",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        API_ROUTES.SEND_NOTIFICATION(id),
        data
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send email"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) state.bookings[index] = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        console.log(
          "6. [Redux Reducer] Removing ID from Store:",
          action.payload
        );
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      });
  },
});

export default bookingSlice.reducer;
