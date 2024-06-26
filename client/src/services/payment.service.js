import API from "config/api.config";
const API_URL = "/payments";

let payment = {};

payment.savePayment = (payment, plan = false) => {
  return API.post(`${API_URL}?plan=${plan}`, payment);
};

payment.updatePayment = (id, payment, plan = false) => {
  return API.put(`${API_URL}/${id}?plan=${plan}`, payment);
};

payment.getPayments = (patientId, plan = false, options = {}) => {
  return API.get(`/patients/${patientId}/payments?plan=${plan}`, options);
};

payment.deletePayment = (id, plan = false) => {
  return API.delete(`${API_URL}/${id}?plan=${plan}`);
};

export default payment;
