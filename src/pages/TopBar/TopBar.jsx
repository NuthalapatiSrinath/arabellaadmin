import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
// ... imports
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  UserCircle,
} from "lucide-react"; // Import UserCircle
import styles from "./TopBar.module.css";

const TopBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };
  // ✅ New State for Dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const handleLoginClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate("/signup");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    setShowDropdown(false); // Close dropdown
    navigate("/");
  };

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate("/rooms");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };

  // ✅ New Handler for My Bookings
  const handleMyBookings = () => {
    navigate("/my-bookings");
    setShowDropdown(false);
  };

  return (
    <div
      className={`${styles.mainNav} ${isScrolled ? styles.stickyShadow : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.navContent}>
          {/* Logo */}
          <Link to="/" className={styles.logoGroup}>
            <span className={styles.logoText}>ARABELLA</span>
            <span className={styles.logoSub}>MOTOR INN</span>
          </Link>

          {/* Nav Links */}
          <nav className={styles.navLinks}>
            <Link to="/" className={isActive("/") ? styles.linkActive : ""}>
              Home
            </Link>
            <Link
              to="/about"
              className={isActive("/about") ? styles.linkActive : ""}
            >
              About Us
            </Link>
            <Link
              to="/rooms"
              className={isActive("/rooms") ? styles.linkActive : ""}
            >
              Rooms
            </Link>
            <Link
              to="/gallery"
              className={isActive("/gallery") ? styles.linkActive : ""}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className={isActive("/contact") ? styles.linkActive : ""}
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {isAuthenticated ? (
              // ✅ UPDATED USER PROFILE WITH DROPDOWN
              <div
                className={styles.userProfile}
                ref={dropdownRef}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className={styles.userName}>
                  <User size={16} />
                  <span>{user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} /> {/* Dropdown Arrow */}
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    {/* ✅ 1. NEW PROFILE LINK */}
                    <div
                      className={styles.dropdownItem}
                      onClick={handleProfileClick}
                    >
                      <UserCircle size={16} />
                      My Profile
                    </div>

                    {/* 2. EXISTING BOOKINGS LINK */}
                    <div
                      className={styles.dropdownItem}
                      onClick={handleMyBookings}
                    >
                      <Calendar size={16} />
                      My Bookings
                    </div>

                    {/* 3. LOGOUT */}
                    <div className={styles.dropdownItem} onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <button className={styles.loginBtn} onClick={handleLoginClick}>
                  LOGIN
                </button>
                <button
                  className={styles.signupBtn}
                  onClick={handleSignupClick}
                >
                  SIGN UP
                </button>
              </div>
            )}

            {/* Book Now Button */}
            <button className={styles.bookBtn} onClick={handleBookNow}>
              BOOK NOW
            </button>

            {/* Mobile Toggle */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenuContainer} ${
          isMenuOpen ? styles.menuOpen : ""
        }`}
      >
        <div className={styles.mobileLinks}>
          <Link to="/" onClick={handleLinkClick}>
            Home
          </Link>
          <Link to="/about" onClick={handleLinkClick}>
            About Us
          </Link>
          <Link to="/rooms" onClick={handleLinkClick}>
            Rooms
          </Link>
          <Link to="/gallery" onClick={handleLinkClick}>
            Gallery
          </Link>
          <Link to="/contact" onClick={handleLinkClick}>
            Contact
          </Link>

          {/* Added My Bookings to Mobile Menu as well for better UX */}
          {isAuthenticated && (
            <Link to="/my-bookings" onClick={handleLinkClick}>
              My Bookings
            </Link>
          )}

          {!isAuthenticated ? (
            <div className={styles.mobileAuthRow}>
              <button
                className={styles.mobileAuthBtn}
                onClick={handleLoginClick}
              >
                LOGIN
              </button>
              <button
                className={styles.mobileAuthBtn}
                onClick={handleSignupClick}
              >
                SIGN UP
              </button>
            </div>
          ) : (
            <button className={styles.mobileAuthBtn} onClick={handleLogout}>
              LOGOUT
            </button>
          )}

          <div className={styles.mobileBtnWrapper}>
            <button className={styles.contactBtnMobile} onClick={handleBookNow}>
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
