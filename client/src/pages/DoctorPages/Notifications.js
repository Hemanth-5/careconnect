import React, { useState, useEffect } from "react";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Assuming this endpoint exists
      const response = await doctorAPI.getNotifications();
      setNotifications(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await doctorAPI.markNotificationAsRead(notificationId);

      // Update the local state to reflect the change
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);

      // We would need an endpoint for this, for now just update local state
      const unreadNotifications = notifications
        .filter((n) => !n.isRead)
        .map((n) => n._id);

      for (const id of unreadNotifications) {
        await doctorAPI.markNotificationAsRead(id);
      }

      // Update all as read in local state
      setNotifications(
        notifications.map((notification) => ({ ...notification, isRead: true }))
      );

      setLoading(false);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="doctor-notifications">
      {/* Coming Soon Notice Card */}
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <i className="fas fa-code"></i>
        </div>
        <h2>This Feature is Coming Soon</h2>
        <p>
          We're working hard to implement real-time notifications. Check back
          later!
        </p>
      </div>

      {/* <div className="notifications-header">
        <h1 className="page-title">Notifications</h1>
        {unreadCount > 0 && (
          <Button
            variant="primary"
            onClick={handleMarkAllAsRead}
            disabled={loading}
          >
            Mark All as Read
          </Button>
        )}
      </div> */}

      {/* {error && <div className="alert alert-danger">{error}</div>} */}

      {/* {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.length > 0 ? (
            <>
              {unreadCount > 0 && (
                <div className="notifications-section">
                  <h2 className="section-title">Unread ({unreadCount})</h2>
                  {notifications
                    .filter((notification) => !notification.isRead)
                    .map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${
                          !notification.isRead ? "unread" : ""
                        }`}
                      >
                        <div className="notification-icon">
                          <i
                            className={getNotificationIcon(notification.type)}
                          ></i>
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">
                            {notification.message}
                          </p>
                          <p className="notification-date">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            className="mark-read-btn"
                            onClick={() => handleMarkAsRead(notification._id)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {notifications.filter((n) => n.isRead).length > 0 && (
                <div className="notifications-section">
                  <h2 className="section-title">Read</h2>
                  {notifications
                    .filter((notification) => notification.isRead)
                    .map((notification) => (
                      <div key={notification._id} className="notification-item">
                        <div className="notification-icon">
                          <i
                            className={getNotificationIcon(notification.type)}
                          ></i>
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">
                            {notification.message}
                          </p>
                          <p className="notification-date">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-notifications">
              <i className="fas fa-bell-slash"></i>
              <p>You don't have any notifications yet.</p>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

// Helper function to determine icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case "appointment":
      return "fas fa-calendar-check";
    case "prescription":
      return "fas fa-prescription";
    case "message":
      return "fas fa-envelope";
    case "system":
      return "fas fa-cog";
    default:
      return "fas fa-bell";
  }
};

export default Notifications;
