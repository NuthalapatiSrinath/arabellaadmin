import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { logout } from "../../redux/slices/authSlice"; // Added logout action
import {
  Lock,
  Settings,
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  UserCircle,
  Bell,
} from "lucide-react";
import styles from "./HomePage.module.css";

// --- IMPORT VIEWS ---
import DashboardOverview from "../../components/DashboardViews/DashboardOverview";
import ManageRooms from "../../components/DashboardViews/ManageRooms";
import ManageBookings from "../../components/DashboardViews/ManageBookings";
import ManageUsers from "../../components/DashboardViews/ManageUsers"; // ✅ Uncommented this
// import SettingsPage from "../../components/DashboardViews/SettingsPage";

const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // State to track active view
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Open Auth Modal if not logged in
  useEffect(() => {
    if (!isAuthenticated) dispatch(openModal({ type: "AUTH" }));
  }, [isAuthenticated, dispatch]);

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    // window.location.reload(); // Optional: Redux state change handles the UI update
  };

  // --- CONTENT ROUTER ---
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />;
      case "rooms":
        return <ManageRooms />;
      case "bookings":
        return <ManageBookings />;
      case "users":
        return <ManageUsers />; // ✅ Uncommented this

      default:
        return <DashboardOverview />;
    }
  };

  // --- RESTRICTED VIEW (If not logged in) ---
  if (!isAuthenticated) {
    return (
      <div className={styles.RestrictedContainer}>
        <div className={styles.RestrictedCard}>
          <div className={styles.LockIconWrapper}>
            <Lock size={48} />
          </div>
          <h1>Arabella Admin</h1>
          <p>Please sign in to access the Hotel Management Dashboard.</p>
          <button
            className={styles.LoginButton}
            onClick={() => dispatch(openModal({ type: "AUTH" }))}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT ---
  return (
    <div className={styles.LayoutContainer}>
      {/* SIDEBAR */}
      <aside
        className={`${styles.Sidebar} ${
          !sidebarOpen ? styles.SidebarCollapsed : ""
        }`}
      >
        <div className={styles.SidebarHeader}>
          <div className={styles.Logo}>
            <div className={styles.LogoIcon}>A</div>
            <span className={styles.LogoText}>
              Arabella<span className={styles.LogoAccent}>Admin</span>
            </span>
          </div>
        </div>

        <nav className={styles.NavMenu}>
          <div className={styles.NavLabel}>MAIN MENU</div>

          <button
            className={
              activeView === "dashboard" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={
              activeView === "rooms" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("rooms")}
          >
            <BedDouble size={20} />
            <span>Manage Rooms</span>
          </button>

          <button
            className={
              activeView === "bookings" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("bookings")}
          >
            <CalendarDays size={20} />
            <span>Bookings</span>
          </button>

          {/* ✅ Users Button (Now Active) */}
          <button
            className={
              activeView === "users" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("users")}
          >
            <Users size={20} />
            <span>Guests / Users</span>
          </button>

          {/* <div className={styles.NavLabel}>SYSTEM</div> */}

          {/* <button
            className={
              activeView === "settings" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button> */}
        </nav>

        <div className={styles.SidebarFooter}>
          <div className={styles.UserProfile}>
            <UserCircle size={32} className={styles.UserAvatar} />
            <div className={styles.UserInfo}>
              <span className={styles.UserName}>{user?.name || "Admin"}</span>
              <span className={styles.UserRole}>Hotel Manager</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.MainContent}>
        {/* Top Navbar */}
        <header className={styles.TopBar}>
          <div className={styles.TopLeft}>
            <button
              className={styles.MenuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h2 className={styles.PageTitle}>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
          </div>

          <div className={styles.TopRight}>
            <button
              className={styles.LogoutBtn}
              onClick={handleLogout} // Updated to use Redux logout
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className={styles.ContentBody}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default HomePage;
