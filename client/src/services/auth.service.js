import API from "config/auth.config";

let auth = {};

/**
 * Login
 * @body User informations
 */
auth.login = (auth) => {
  return API.post(`/login`, auth);
}

/**
 * Register
 * @body User informations
 */
auth.register = (auth) => {
  return API.post(`/register`, auth);
}

/**
 * Logout
 */
auth.logout = () => {
  return API.post(`/logout`);
}

export default auth;