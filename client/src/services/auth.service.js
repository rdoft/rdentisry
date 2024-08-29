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
 * Control reset token
 * @param token
 */
auth.controlToken = (token, type, options = {}) => {
  return API.get(`/tokens/${token}?type=${type}`, options);
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
 * Init verify for email
 */
auth.initVerify = (email) => {
  return API.post(`/verify`, email);
};

/**
 * Complete the email verification
 */
auth.completeVerify = (token, options = {}) => {
  return API.post(`/verify/${token}`);
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
