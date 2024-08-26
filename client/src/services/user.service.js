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

export default user;
