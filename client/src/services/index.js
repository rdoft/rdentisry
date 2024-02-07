import patient from "services/patient.service";
import doctor from "services/doctor.service";
import appointment from "services/appointment.service";
import payment from "services/payment.service";
import notification from "services/notification.service";
import note from "services/note.service";
import procedure from "./procedure.service";
import patientProcedure from "./patientProcedure.service";
import procedureCategory from "./procedureCategory.service";
import auth from "./auth.service";

const PatientService = patient;
const DoctorService = doctor;
const AppointmentService = appointment;
const PaymentService = payment;
const NotificationService = notification;
const NoteService = note;
const ProcedureService = procedure;
const PatientProcedureService = patientProcedure;
const ProcedureCategoryService = procedureCategory;
const AuthService = auth;

export {
  PatientService,
  DoctorService,
  AppointmentService,
  PaymentService,
  NotificationService,
  NoteService,
  ProcedureService,
  PatientProcedureService,
  ProcedureCategoryService,
  AuthService,
};
