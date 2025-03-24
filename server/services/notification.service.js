import Notification from "../models/notification.model.js";

// Get notifications for a patient
const getPatientNotifications = async (userId) => {
  try {
    return await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 notifications
  } catch (error) {
    throw new Error("Error fetching notifications: " + error.message);
  }
};

// Get notifications for any user
const getNotifications = async (userId) => {
  try {
    return await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 notifications
  } catch (error) {
    throw new Error("Error fetching notifications: " + error.message);
  }
};

// Mark a notification as read
const acknowledgeNotification = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error acknowledging notification: " + error.message);
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error marking notification as read: " + error.message);
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (userId) => {
  try {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  } catch (error) {
    throw new Error(
      "Error marking all notifications as read: " + error.message
    );
  }
};

// Create a new notification
const createNotification = async (notificationData) => {
  try {
    const newNotification = new Notification({
      recipient: notificationData.recipient,
      type: notificationData.type,
      message: notificationData.message,
      relatedId: notificationData.relatedId,
      isRead: false,
      createdAt: new Date(),
    });
    return await newNotification.save();
  } catch (error) {
    throw new Error("Error creating notification: " + error.message);
  }
};

const NotificationService = {
  getPatientNotifications,
  getNotifications,
  acknowledgeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
};

export default NotificationService;
