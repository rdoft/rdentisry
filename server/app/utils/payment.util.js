// Process payments and calc dept/overdue/upcoming status for patients
const processPatientsPayments = (patients) => {
  const today = new Date();

  for (const patient of patients) {
    let totalPaid = 0;
    let totalPaidPlan = 0;
    let completedTotal = 0;

    // Create a map of totalPaidPlan amount for each patient
    // and a map of totalPaid amount for each patient
    patient.payments.map((payment) => {
      totalPaid += payment.amount;
      totalPaidPlan += payment.isPlanned ? payment.amount : 0;
    });
    // Create a map of completedPrice amount of procedure for each patient
    patient.visits.map((visit) => {
      visit.patientProcedures.map((procedure) => {
        completedTotal += procedure.price * ((100 - visit.discount) / 100);
      });
    });

    // Reduce the paymentPlans as much as payments amount
    patient.paymentPlans = processPatientPayments(
      patient.paymentPlans,
      totalPaidPlan
    );

    // Calculate overdue and waiting status
    patient.overdue = patient.paymentPlans.some(
      (plan) =>
        plan.amount - plan.paid > 0 &&
        new Date(plan.plannedDate).setHours(0, 0, 0, 0) <
          today.setHours(0, 0, 0, 0)
    );
    patient.waiting = patient.paymentPlans.some(
      (plan) =>
        plan.amount - plan.paid > 0 &&
        today.setHours(0, 0, 0, 0) <=
          new Date(plan.plannedDate).setHours(0, 0, 0, 0)
    );
    // Calculate the dept of the patient
    patient.dept =
      !patient.overdue && !patient.waiting
        ? completedTotal - totalPaid > 0
          ? completedTotal - totalPaid
          : 0
        : -1;
  }

  return patients;
};

// Process the payment plans of the patient
const processPatientPayments = (paymentPlans, totalPaid = 0) => {
  // Reduce the paymentPlans as much as payments amount
  for (let plan of paymentPlans) {
    if (plan.amount <= totalPaid) {
      totalPaid -= plan.amount;
      plan.paid = plan.amount;
    } else {
      plan.paid = totalPaid;
      totalPaid = 0; // Fully reduced
    }
  }

  return paymentPlans;
};

module.exports = {
  processPatientPayments,
  processPatientsPayments,
};
