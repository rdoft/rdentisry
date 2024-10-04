import API from "config/api.config";
const API_URL = "/user";

let user = {};

/**
 * Get user information
 */
user.getUser = (options = {}) => {
  return API.get(API_URL, options);
};

/**
 * Update user name and password
 */
user.saveUser = (user) => {
  return API.put(API_URL, user);
};

/**
 * Get user settings
 */
user.getSettings = () => {
  return API.get(`${API_URL}/settings`);
};

/**
 * Update user settings
 * @body {object} preference - The user's preference like reminder
 */
user.saveSettings = (settings) => {
  return API.put(`${API_URL}/settings`, settings);
};

export default user;
