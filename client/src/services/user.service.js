import API from "config/api.config";
const API_URL = "/user";

let user = {};

/**
 * Get user information
 * userId is already in the request
 */
user.getUser = (options = {}) => {
  return API.get(API_URL, options);
};

/**
 * Get referral code of the user
 * userId and subscription is already in the request
 */
user.getReferralCode = (options = {}) => {
  return API.get(`${API_URL}/referral`, options);
};

/**
 * Update user name and password
 * userId is already in the request
 */
user.saveUser = (user) => {
  return API.put(API_URL, user);
};

/**
 * Get user settings
 * userId is already in the request
 */
user.getSettings = () => {
  return API.get(`${API_URL}/settings`);
};

/**
 * Update user settings
 * userId is already in the request
 * @body {object} setting - The user's preference like reminder
 */
user.saveSettings = (settings) => {
  return API.put(`${API_URL}/settings`, settings);
};

export default user;
