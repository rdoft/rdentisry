import API from "config/api.config";
const API_URL = "/notifications";

let notification = {};

/**
 * Get notifications list
 */
notification.getNotifications = (status, options = {}) => {
  if (status) {
    return API.get(`${API_URL}?status=${status}`, options);
  } else {
    return API.get(`${API_URL}`, options);
  }
};

/**
 * Update the notificaiton
 * @param id id of the notification
 * @body Notification informations
 */
notification.updateNotification = (notification) => {
  return API.put(`${API_URL}/${notification.id}`, notification);
};

/**
 * Update the all notificaitons
 * @body status of the notification
 */
notification.updateNotifications = (status) => {
  return API.put(`${API_URL}`, { status });
};

export default notification;
