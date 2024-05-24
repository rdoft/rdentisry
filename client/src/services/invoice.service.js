import API from "config/api.config";
const API_URL = "";

let invoice = {};

/**
 * Update the invoice to the patient
 * @param patientId id of the patient
 * @param invoiceId id of the invoice
 * @body invoice informations
 */
invoice.updateInvoice = (invoice) => {
  return API.put(
    `${API_URL}/patients/${invoice.patient.id}/invoices/${invoice.id}`,
    invoice
  );
};

/**
 * Delete the invoice of the patient
 * @param patientId id of the patient
 * @param id id of the invoice
 */
invoice.deleteInvoice = (patientId, id) => {
  return API.delete(`${API_URL}/patients/${patientId}/invoices/${id}`);
};

export default invoice;
