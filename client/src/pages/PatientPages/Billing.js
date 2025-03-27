import React from "react";
import "./Billing.css";

const Billing = () => {
  // const [loading, setLoading] = useState(true);
  // const [notifications, setNotifications] = useState([]);
  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);
  // const [filter, setFilter] = useState("all");
  // const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // const fetchNotifications = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await patientAPI.getNotifications();
  //     if (response && response.data) {
  //       // Sort notifications by date (newest first)
  //       const sortedNotifications = response.data.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );
  //       setNotifications(sortedNotifications);
  //     }
  //     setError(null);
  //   } catch (err) {
  //     console.error("Error fetching notifications:", err);
  //     setError("Failed to load notifications. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleMarkAsRead = async (notificationId) => {
  //   try {
  //     await patientAPI.markNotificationAsRead(notificationId);

  //     // Update notification in state
  //     setNotifications(
  //       notifications.map((notification) =>
  //         notification._id === notificationId
  //           ? { ...notification, isRead: true }
  //           : notification
  //       )
  //     );

  //     setSuccess("Notification marked as read.");

  //     // Clear success message after 2 seconds
  //     setTimeout(() => setSuccess(null), 2000);
  //   } catch (err) {
  //     console.error("Error marking notification as read:", err);
  //     setError("Failed to update notification. Please try again.");
  //   }
  // };

  // const handleMarkAllAsRead = async () => {
  //   try {
  //     await patientAPI.markAllNotificationsAsRead();

  //     // Update state to mark all notifications as read
  //     setNotifications(
  //       notifications.map((notification) => ({
  //         ...notification,
  //         isRead: true,
  //       }))
  //     );

  //     setSuccess("All notifications marked as read.");

  //     // Clear success message after 2 seconds
  //     setTimeout(() => setSuccess(null), 2000);
  //   } catch (err) {
  //     console.error("Error marking all notifications as read:", err);
  //     setError("Failed to update notifications. Please try again.");
  //   }
  // };

  // // Format date for display
  // const formatDate = (dateString) => {
  //   const now = new Date();
  //   const date = new Date(dateString);

  //   // Check if it's today
  //   if (date.toDateString() === now.toDateString()) {
  //     return `Today at ${date.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     })}`;
  //   }

  //   // Check if it's yesterday
  //   const yesterday = new Date(now);
  //   yesterday.setDate(now.getDate() - 1);
  //   if (date.toDateString() === yesterday.toDateString()) {
  //     return `Yesterday at ${date.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     })}`;
  //   }

  //   // Otherwise return the full date
  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // // Get notification icon based on type
  // const getNotificationIcon = (type) => {
  //   switch (type) {
  //     case "appointment":
  //       return "fas fa-calendar-alt";
  //     case "prescription":
  //       return "fas fa-prescription-bottle-alt";
  //     case "message":
  //       return "fas fa-comment-medical";
  //     case "report":
  //       return "fas fa-file-medical-alt";
  //     default:
  //       return "fas fa-bell";
  //   }
  // };

  // // Filter notifications based on search and filter
  // const filteredNotifications = notifications.filter((notification) => {
  //   // Apply filter
  //   if (filter === "unread" && notification.isRead) {
  //     return false;
  //   }

  //   // Apply search
  //   if (searchTerm) {
  //     const searchLower = searchTerm.toLowerCase();
  //     return notification.message.toLowerCase().includes(searchLower);
  //   }

  //   return true;
  // });

  // // Get unread count
  // const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="patient-billing">
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
          <div className="unread-badge">{unreadCount} unread</div>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="notifications-toolbar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="notifications-actions">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-tab ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                notification.isRead ? "" : "unread"
              }`}
            >
              <div className="notification-icon">
                <i className={getNotificationIcon(notification.type)}></i>
              </div>

              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">
                  {formatDate(notification.createdAt)}
                </div>
              </div>

              {!notification.isRead && (
                <button
                  className="mark-read-button"
                  onClick={() => handleMarkAsRead(notification._id)}
                  title="Mark as read"
                >
                  <i className="fas fa-check"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-bell-slash"></i>
          </div>
          <h2>No notifications found</h2>
          <p>
            {filter === "unread"
              ? "You have no unread notifications."
              : searchTerm
              ? "No notifications match your search."
              : "You don't have any notifications yet."}
          </p>
          {(filter !== "all" || searchTerm) && (
            <Button
              variant="primary"
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )} */}
    </div>
  );
};

export default Billing;
