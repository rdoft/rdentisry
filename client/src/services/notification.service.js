import API from "config/api.config";
const API_URL = "/notifications";

let notification = {};

/**
 * Get notifications list
 */
notification.getNotifications = () => {
  return API.get(API_URL);
};

/**
 * Update the notificaiton
 * @param id id of the notification
 * @body Notification informations
 */
notification.updateNotification = (notification) => {
  return API.put(`${API_URL}/${notification.id}`, notification);
};

export default notification;
