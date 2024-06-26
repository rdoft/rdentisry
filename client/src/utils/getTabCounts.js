import {
  AppointmentService,
  NoteService,
  PatientProcedureService,
  PaymentService,
} from "services";

// Get all tabs counts based on the patient
const getTabCounts = async (patient) => {
  let counts = {
    appointment: { pending: 0, completed: 0 },
    payment: { pending: 0, completed: 0 },
    note: { other: 0 },
    procedure: { pending: 0, completed: 0 },
  };

  try {
    const appointments = await AppointmentService.getAppointments({
      patientId: patient.id,
    });
    const plannedPayments = await PaymentService.getPayments(patient.id, true);
    const notes = await NoteService.getNotes(patient.id);
    const procedures = await PatientProcedureService.getPatientProcedures({
      patientId: patient.id,
    });

    // Count the appointments based on its status
    appointments.data.forEach((appointment) => {
      appointment.status === "active"
        ? counts.appointment.pending++
        : counts.appointment.completed++;
    });
    // Count the payments based on its status
    plannedPayments.data.forEach((payment) => {
      payment.paid === payment.amount
        ? counts.payment.completed++
        : counts.payment.pending++;
    });
    // Count the procedures based on its status
    procedures.data.forEach((procedure) => {
      procedure.completedDate
        ? counts.procedure.completed++
        : counts.procedure.pending++;
    });
    // Count the notes
    counts.note.other = notes.data.length ?? 0;

    return counts;
  } catch (error) {
    throw error;
  }
};

export default getTabCounts;
