import API from "config/api.config";
const API_URL = "/subscriptions";

let subscription = {};

// TODO: Implement subscription service methods
subscription.getPricings = (options = {}) => {
  return API.get(`${API_URL}/pricings`, options);
};

subscription.checkout = (subscription, options = {}) => {
  return API.post(`${API_URL}/checkout`, subscription, options);
};

export default subscription;
