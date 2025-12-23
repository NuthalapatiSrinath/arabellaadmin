import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/Auth/LoginPage"; // Correct path

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- Public Auth Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        {/* Add Signup/Forgot Password routes here later */}
        {/* <Route path="/signup" element={<SignupPage />} /> */}

        {/* --- Protected Dashboard Routes --- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Main Dashboard connects here */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard/*" element={<HomePage />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}
