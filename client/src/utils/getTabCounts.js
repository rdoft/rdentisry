import {
  AppointmentService,
  NoteService,
  PatientProcedureService,
  PaymentService,
} from "services";

// Get all tabs counts based on the patient
const getTabCounts = async (patient) => {
  try {
    const appointments = await AppointmentService.getAppointments({
      patientId: patient.id,
    });
    const payments = await PaymentService.getPayments(patient.id);
    const notes = await NoteService.getNotes(patient.id);
    const procedures = await PatientProcedureService.getPatientProcedures({
      patientId: patient.id,
    });

    return {
      appointment: appointments.data.length ?? 0,
      payment: payments.data.length ?? 0,
      note: notes.data.length ?? 0,
      procedure: procedures.data.length ?? 0,
    };
  } catch (error) {
    throw error;
  }
};

export default getTabCounts;
