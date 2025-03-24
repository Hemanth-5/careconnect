import React from "react";
import "./NotificationItem.css";

const NotificationItem = ({ notification }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);

    // If it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Otherwise
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return "fas fa-calendar-alt";
      case "prescription":
        return "fas fa-prescription-bottle-alt";
      case "message":
        return "fas fa-comment-medical";
      case "report":
        return "fas fa-file-medical-alt";
      default:
        return "fas fa-bell";
    }
  };

  return (
    <div
      className={`notification-item-card ${
        notification.isRead ? "" : "unread"
      }`}
    >
      <div className="notification-icon">
        <i className={getNotificationIcon(notification.type)}></i>
      </div>

      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
        <p className="notification-time">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
