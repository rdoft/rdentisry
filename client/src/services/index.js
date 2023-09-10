import patient from "services/patient.service";
import doctor from "services/doctor.service";
import appointment from "services/appointment.service";
import payment from "services/payment.service";

const PatientService = patient;
const DoctorService = doctor;
const AppointmentService = appointment;
const PaymentService = payment;

export { PatientService, DoctorService, AppointmentService, PaymentService };
