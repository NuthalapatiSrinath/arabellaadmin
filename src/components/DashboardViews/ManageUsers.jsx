import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice"; // Ensure you have this export
import {
  Search,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Award,
} from "lucide-react";
import styles from "./ManageUsers.module.css";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter Logic
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // VIP Logic: Highlight users who spent more than ₹50,000
  const isVip = (spent) => spent > 50000;

  if (loading && users.length === 0)
    return <div className={styles.loading}>Loading Users...</div>;

  return (
    <div className={styles.container}>
      {/* Header & Search */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Registered Guests</h2>
          <p className={styles.subtitle}>
            View guest details and spending history.
          </p>
        </div>

        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Guest Profile</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Stats</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  {/* 1. Profile */}
                  <td>
                    <div className={styles.profileCell}>
                      <div
                        className={`${styles.avatar} ${
                          isVip(user.totalSpent) ? styles.vipAvatar : ""
                        }`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.userName}>
                          {user.name}
                          {isVip(user.totalSpent) && (
                            <Award
                              size={14}
                              className={styles.vipIcon}
                              title="VIP Guest"
                            />
                          )}
                        </div>
                        <div className={styles.joinedDate}>
                          <Calendar size={10} style={{ marginRight: 4 }} />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Contact */}
                  <td>
                    <div className={styles.contactRow}>
                      <Mail size={12} /> {user.email}
                    </div>
                    <div className={styles.contactRow}>
                      <Phone size={12} /> {user.phone || "N/A"}
                    </div>
                  </td>

                  {/* 3. Status */}
                  <td>
                    {user.isVerified ? (
                      <span className={`${styles.badge} ${styles.green}`}>
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.gray}`}>
                        <XCircle size={12} /> Unverified
                      </span>
                    )}
                  </td>

                  {/* 4. Stats */}
                  <td>
                    <div className={styles.statsBadge}>
                      {user.bookingCount} Bookings
                    </div>
                  </td>

                  {/* 5. Money Spent */}
                  <td>
                    <div className={styles.money}>
                      <DollarSign size={14} />₹
                      {user.totalSpent?.toLocaleString() || 0}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
