import API from "config/api.config";
const API_URL = "/payments";

let payment = {};

payment.savePayment = (payment) => {
  return API.post(API_URL, payment);
};

payment.updatePayment = (id, payment) => {
  return API.put(`${API_URL}/${id}`, payment);
};

payment.getPayments = (patientId) => {
  return API.get(`/patients/${patientId}/payments`);
};

payment.deletePayment = (id) => {
  return API.delete(`${API_URL}/${id}`);
};

export default payment;
