import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  updateBooking,
  deleteBooking,
} from "../../redux/slices/bookingSlice";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Search,
  Trash2,
  Filter,
  Phone,
  LogOut,
  Mail,
} from "lucide-react";
import NotificationModal from "./BookingModals/NotificationModal"; // Import the modal
import styles from "./ManageBookings.module.css";

const ManageBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ STATE FOR MODAL
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // --- LOGISTICS STATS ---
  const today = new Date().toISOString().split("T")[0];
  const stats = {
    arriving: bookings.filter((b) => b.checkIn && b.checkIn.startsWith(today))
      .length,
    departing: bookings.filter(
      (b) => b.checkOut && b.checkOut.startsWith(today)
    ).length,
    pending: bookings.filter((b) => b.status === "Pending").length,
  };

  // --- FILTERS ---
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    const matchesSearch =
      (b.guestName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id, newStatus, guestName) => {
    if (window.confirm(`Change status to ${newStatus} for ${guestName}?`)) {
      dispatch(updateBooking({ id, updates: { status: newStatus } }));
    }
  };

  const handleDelete = (id) => {
    console.log("🛑 Delete Clicked for ID:", id);
    if (window.confirm("Are you sure? This action is irreversible.")) {
      dispatch(deleteBooking(id))
        .unwrap()
        .then(() => console.log("✅ Delete Successful"))
        .catch((err) => console.error("❌ Delete Failed:", err));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className={`${styles.badge} ${styles.green}`}>
            <CheckCircle size={12} /> Confirmed
          </span>
        );
      case "CheckedIn":
        return (
          <span className={`${styles.badge} ${styles.blue}`}>
            <Calendar size={12} /> Checked In
          </span>
        );
      case "CheckedOut":
        return (
          <span className={`${styles.badge} ${styles.gray}`}>
            <LogOut size={12} /> Checked Out
          </span>
        );
      case "Cancelled":
        return (
          <span className={`${styles.badge} ${styles.red}`}>
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.yellow}`}>
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (loading && bookings.length === 0)
    return <div className={styles.loading}>Loading Bookings...</div>;

  return (
    <div className={styles.container}>
      {/* 1. Logistics Summary */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Arriving Today</span>
          <span className={styles.statValue}>{stats.arriving}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Departing Today</span>
          <span className={styles.statValue}>{stats.departing}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Pending Actions</span>
          <span className={`${styles.statValue} ${styles.textYellow}`}>
            {stats.pending}
          </span>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search Guest or Invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterWrapper}>
          <Filter size={18} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="CheckedIn">Checked In</option>
            <option value="CheckedOut">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 3. Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Guest Details</th>
              <th>Room & Dates</th>
              <th>Status</th>
              <th>Total</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className={styles.guestName}>{b.guestName}</div>
                    <div className={styles.guestRef}>{b.invoiceNumber}</div>
                    <div className={styles.guestContact}>
                      <Phone size={10} style={{ marginRight: 4 }} /> {b.phone}
                    </div>
                  </td>
                  <td>
                    <div className={styles.roomName}>
                      {b.roomType?.name || "Unknown Room"}
                    </div>
                    <div className={styles.dates}>
                      {new Date(b.checkIn).toLocaleDateString()} →{" "}
                      {new Date(b.checkOut).toLocaleDateString()}
                    </div>
                  </td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td className={styles.price}>₹{b.totalPrice}</td>
                  <td>
                    <div className={styles.actions}>
                      {/* Status Select */}
                      <select
                        className={styles.miniSelect}
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b._id, e.target.value, b.guestName)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirm</option>
                        <option value="CheckedIn">Check In</option>
                        <option value="CheckedOut">Check Out</option>
                        <option value="Cancelled">Cancel</option>
                      </select>

                      {/* ✅ MAIL BUTTON RESTORED */}
                      <button
                        className={styles.iconBtn}
                        title="Send Email"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <Mail size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        className={`${styles.iconBtn} ${styles.btnDelete}`}
                        title="Delete"
                        onClick={() => handleDelete(b._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL RENDER LOGIC RESTORED */}
      {selectedBooking && (
        <NotificationModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default ManageBookings;
