import API from "config/auth.config";

let auth = {};

/**
 * Login
 * @body User informations
 */
auth.login = (auth) => {
  return API.post(`/login`, auth);
};

/**
 * Register
 * @body User informations
 */
auth.register = (auth) => {
  return API.post(`/register`, auth);
};

/**
 * Logout
 */
auth.logout = () => {
  return API.post(`/logout`);
};

/**
 * Send mail to reset password
 */
auth.forgot = (email) => {
  return API.post(`/forgot`, email);
};

/**
 * Reset password
 * @body User informations
 */
auth.reset = (token, auth) => {
  return API.post(`/reset/${token}`, auth);
};

/**
 * Control reset token
 * @param token
 */
auth.control = (token, options = {}) => {
  return API.get(`/reset/${token}`, options);
};

/**
 * Permission check
 */
auth.permission = (options = {}) => {
  return API.get(`/permission`, options);
};

/**
 * Aggree to terms
 * @body User informations
 */
auth.agree = (agreement) => {
  return API.put(`/agree`, agreement);
};

export default auth;
