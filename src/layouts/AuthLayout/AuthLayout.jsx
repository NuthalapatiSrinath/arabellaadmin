import React from "react";
import styles from "./AuthLayout.module.css";
// Ensure you have a logo at this path or update the import
import logo from "../../logo.svg";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className={styles.container}>
      {/* Left Side - Brand / Image */}
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.logoWrapper}>
            {/* If using text instead of SVG */}
            <h1 className={styles.brandName}>
              Arabella<span style={{ color: "#c5a365" }}>Admin</span>
            </h1>
          </div>
          <p className={styles.brandTagline}>
            Manage your hotel operations with elegance and efficiency.
          </p>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
