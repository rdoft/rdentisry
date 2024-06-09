// Calculate the progress of al payments
const calcProgress = (payments, plannedPayments, total) => {
  let overdue = 0;
  let waiting = 0;
  let progress = 0;
  let completed = 0;

  // Calc completed payment
  completed = payments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);

  for (let plannedPayment of plannedPayments) {
    // Calc overdue payment
    if (new Date(plannedPayment.plannedDate) < new Date()) {
      overdue += plannedPayment.amount - plannedPayment.paid;
    }
  }

  waiting = total - completed > 0 ? total - completed : 0;
  progress =
    total > 0 ? Math.floor((completed / total) * 100) : completed > 0 ? 100 : 0;

  return {
    progress,
    completedAmount: completed,
    waitingAmount: waiting,
    overdueAmount: overdue,
  };
};

export default calcProgress;
