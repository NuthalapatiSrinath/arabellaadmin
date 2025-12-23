import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import navBarReducer from "./slices/navBarSlice"; // Keep existing
import modalReducer from "./slices/modalSlice"; // Keep existing
import roomReducer from "./slices/roomSlice"; // Replaced diamondSlice
import bookingReducer from "./slices/bookingSlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  navBar: navBarReducer,
  modal: modalReducer,
  rooms: roomReducer,
  bookings: bookingReducer,
  users: userReducer,
});

export default rootReducer;
