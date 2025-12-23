import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import apiClient from "../../api/apiClient"; // Direct axios call
import { API_ROUTES } from "../../api/apiRoutes";
import { setCredentials } from "../../redux/slices/authSlice";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import styles from "./AuthStyles.module.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Call Your Existing Backend
      const response = await apiClient.post(API_ROUTES.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      // Response structure: { success: true, data: { ...user, role: "admin" }, token: "..." }
      const { data, token } = response.data;

      // 2. FRONTEND SECURITY CHECK
      // If the user logging in is NOT an admin, block them here.
      if (data.role !== "admin") {
        setError("Access Denied: You do not have admin privileges.");
        setLoading(false);
        return;
      }

      // 3. If Admin, Save to Redux & Redirect
      dispatch(
        setCredentials({
          user: data,
          token: token,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Panel" subtitle="Sign in to manage Arabella Hotel">
      {error && <div className={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <Mail size={20} className={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="admin@arabella.com"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div>
          <div className={styles.inputGroup}>
            <Lock size={20} className={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Checking Access..." : "Login to Dashboard"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
