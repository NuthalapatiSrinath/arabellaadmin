export const API_ROUTES = {
  // --- Auth ---
  LOGIN: "/auth/login",
  GET_PROFILE: "/users/profile",

  // --- Dashboard ---
  DASHBOARD_STATS: "/admin/dashboard/stats",

  // --- Room Management ---
  GET_ALL_ROOMS: "/admin/rooms",
  CREATE_ROOM: "/admin/rooms",
  UPDATE_ROOM: (id) => `/admin/rooms/${id}`,
  DELETE_ROOM: (id) => `/admin/rooms/${id}`,

  // --- Booking Management ---
  GET_ALL_BOOKINGS: "/admin/bookings",
  UPDATE_BOOKING: (id) => `/admin/bookings/${id}`,

  // ✅ 1. FIXED DELETE ROUTE (This was missing)
  DELETE_BOOKING: (id) => `/admin/bookings/${id}`,

  // ✅ 2. FIXED MANUAL MAIL ROUTE (This was missing)
  SEND_NOTIFICATION: (id) => `/admin/bookings/${id}/notify`,

  // --- User Management ---
  GET_ALL_USERS: "/admin/dashboard/users",
};
