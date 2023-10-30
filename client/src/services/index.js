import patient from "services/patient.service";
import doctor from "services/doctor.service";
import appointment from "services/appointment.service";
import payment from "services/payment.service";
import notification from "services/notification.service";
import note from "services/note.service";
import procedure from "./procedure.service";

const PatientService = patient;
const DoctorService = doctor;
const AppointmentService = appointment;
const PaymentService = payment;
const NotificationService = notification;
const NoteService = note;
const ProcedureService = procedure;

export {
  PatientService,
  DoctorService,
  AppointmentService,
  PaymentService,
  NotificationService,
  NoteService,
  ProcedureService,
};
