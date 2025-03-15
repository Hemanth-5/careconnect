import Notification from "../models/notification.model.js";

// Get notifications by user
const getNotificationsByUser = async (userId) => {
  try {
    return await Notification.find({ user: userId })
      .sort({ dateSent: -1 })
      .limit(10);
  } catch (error) {
    throw new Error("Error fetching notifications: " + error.message);
  }
};

// Mark a notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error marking notification as read: " + error.message);
  }
};

const NotificationService = {
  getNotificationsByUser,
  markNotificationAsRead,
};

export default NotificationService;
