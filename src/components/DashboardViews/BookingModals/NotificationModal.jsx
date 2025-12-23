import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendNotification } from "../../../redux/slices/bookingSlice";
import { X, Send, Mail } from "lucide-react";
import styles from "./NotificationModal.module.css";

const NotificationModal = ({ booking, onClose }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    // Backend defaults to Email Only now.
    await dispatch(
      sendNotification({
        id: booking._id,
        data: { customMessage: message },
      })
    );
    setSending(false);
    onClose();
    alert(`Email sent to ${booking.guestName}!`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Mail size={20} className={styles.headerIcon} />
            <h3>Email Guest: {booking.guestName}</h3>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSend} className={styles.body}>
          <div className={styles.infoBox}>
            <p>
              <strong>To:</strong> {booking.email}
            </p>
            <p>
              <strong>Ref:</strong> {booking.invoiceNumber}
            </p>
          </div>

          <label className={styles.label}>Custom Message</label>
          <textarea
            className={styles.textArea}
            rows="6"
            placeholder="Type your message here... (e.g. Your room is ready for early check-in)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.sendBtn} disabled={sending}>
              {sending ? "Sending..." : "Send Email"} <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
