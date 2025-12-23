import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import { API_ROUTES } from "../../api/apiRoutes";

// --- THUNKS ---

// 1. Fetch All Rooms
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ROUTES.GET_ALL_ROOMS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rooms"
      );
    }
  }
);

// 2. Create Room
export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (formData, { rejectWithValue }) => {
    try {
      // 🛑 FIX: Removed manual 'Content-Type' header. Axios sets this automatically with the correct boundary.
      const response = await apiClient.post(API_ROUTES.CREATE_ROOM, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create room"
      );
    }
  }
);

// 3. Update Room
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // 🛑 FIX: Removed manual 'Content-Type' header here too.
      const response = await apiClient.put(
        API_ROUTES.UPDATE_ROOM(id),
        formData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update room"
      );
    }
  }
);

// 4. Delete Room
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(API_ROUTES.DELETE_ROOM(id));
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete room"
      );
    }
  }
);

// --- SLICE ---
const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    loading: false,
    error: null,
    operationSuccess: false,
  },
  reducers: {
    resetOperationStatus: (state) => {
      state.operationSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
        state.operationSuccess = true;
      })
      // Update
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) state.rooms[index] = action.payload;
        state.operationSuccess = true;
      })
      // Delete
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((r) => r._id !== action.payload);
      });
  },
});

export const { resetOperationStatus } = roomSlice.actions;
export default roomSlice.reducer;
