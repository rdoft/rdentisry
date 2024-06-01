const UPCOMMING = 2; // Days of upcoming payment

const processPayments = (patients, payments, all = true) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + UPCOMMING);
  const paymentMap = {};
  let paymentPlans;
  let totalPaid;

  // Create a map of patientId to total planned payment amount
  for (const payment of payments) {
    paymentMap[payment.patientId] = payment.total;
  }

  for (const patient of patients) {
    paymentPlans = patient.paymentPlans;
    totalPaid = paymentMap[patient.patientId] || 0;

    // Reduce the paymentPlans as much as payments amount
    for (let i = 0; i < paymentPlans.length && totalPaid > 0; i++) {
      if (paymentPlans[i].amount <= totalPaid) {
        totalPaid -= paymentPlans[i].amount;
        paymentPlans[i].amount = 0; // Fully reduced
      } else {
        paymentPlans[i].amount -= totalPaid;
        totalPaid = 0; // Fully reduced
      }
    }

    // Set overdue status and upcoming status
    if (all) {
      patient.overdue = paymentPlans.some(
        (plan) =>
          plan.amount > 0 &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) <
            today.setHours(0, 0, 0, 0)
      );
      patient.upcoming = paymentPlans.some(
        (plan) =>
          plan.Amount > 0 &&
          new Date(plan.PlannedDate).setHours(0, 0, 0, 0) <
            tomorrow.setHours(0, 0, 0, 0)
      );
    } else {
      patient.overdue = paymentPlans.some(
        (plan) =>
          plan.amount > 0 &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) ===
            today.setHours(0, 0, 0, 0)
      );
      patient.upcoming = paymentPlans.some(
        (plan) =>
          plan.amount > 0 &&
          new Date(plan.plannedDate).setHours(0, 0, 0, 0) ===
            tomorrow.setHours(0, 0, 0, 0)
      );
    }
  }

  return patients;
};

module.exports = {
  processPayments,
};
