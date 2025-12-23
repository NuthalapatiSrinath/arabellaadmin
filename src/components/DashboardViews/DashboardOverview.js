import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { API_ROUTES } from "../../api/apiRoutes";
import {
  DollarSign,
  TrendingUp,
  CalendarCheck,
  Users,
  BedDouble,
  Award,
} from "lucide-react";
import styles from "./DashboardOverview.module.css";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    bookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    popularRoom: "N/A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get(API_ROUTES.DASHBOARD_STATS);
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className={styles.loading}>Loading Data...</div>;

  return (
    <div className={styles.container}>
      {/* Welcome Section */}
      <div className={styles.welcomeBanner}>
        <h2>Welcome back, Admin!</h2>
        <p>Here is what's happening at Arabella Hotel today.</p>
      </div>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Total Revenue */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.gold}`}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Revenue</h4>
            <span className={styles.statValue}>
              ₹{stats.totalRevenue?.toLocaleString() || 0}
            </span>
            <span className={styles.subtext}>Lifetime Earnings</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.green}`}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Monthly Revenue</h4>
            <span className={styles.statValue}>
              ₹{stats.monthlyRevenue?.toLocaleString() || 0}
            </span>
            <span className={styles.subtext}>This Month</span>
          </div>
        </div>

        {/* Bookings */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.blue}`}>
            <CalendarCheck size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Bookings</h4>
            <span className={styles.statValue}>{stats.bookings}</span>
            <span className={styles.subtext}>Reservations Made</span>
          </div>
        </div>

        {/* Users */}
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.purple}`}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Registered Guests</h4>
            <span className={styles.statValue}>{stats.users}</span>
            <span className={styles.subtext}>Verified Accounts</span>
          </div>
        </div>
      </div>

      {/* Secondary Details */}
      <div className={styles.detailSection}>
        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <BedDouble size={20} />
            <h3>Room Inventory</h3>
          </div>
          <div className={styles.bigNumber}>{stats.rooms}</div>
          <p>Active Room Types</p>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <Award size={20} />
            <h3>Most Popular Room</h3>
          </div>
          <div className={styles.highlightText}>{stats.popularRoom}</div>
          <p>Highest Booking Frequency</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
