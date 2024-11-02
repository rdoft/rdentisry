import API from "config/api.config";
const API_URL = "/subscriptions";

let subscription = {};

subscription.getPricings = (options = {}) => {
  return API.get(`${API_URL}/pricings`, options);
};

subscription.checkout = (subscription, options = {}) => {
  return API.post(`${API_URL}/checkout`, subscription, options);
};

subscription.getSubscription = (options = {}) => {
  return API.get(`${API_URL}/subscription`, options);
};

subscription.updateSubscription = (subscription, options = {}) => {
  return API.put(`${API_URL}/subscription`, subscription, options);
};

subscription.cancelSubscription = (options = {}) => {
  return API.post(`${API_URL}/subscription/cancel`, options);
};

export default subscription;
