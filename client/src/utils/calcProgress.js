// Calculate the progress of al payments
const calcProgress = (payments) => {
  let total = 0;
  let overdue = 0;
  let completed = 0;
  let progress = 0;

  for (let payment of payments) {
    // Calc completed payment
    if (payment.actualDate) {
      completed += payment.amount;
    } else {
      // Calc overdue payment
      if (payment.plannedDate && new Date(payment.plannedDate) < new Date()) {
        overdue += payment.amount;
      }
    }
    // Calc total payment
    total += payment.amount;
  }

  progress = total > 0 ? Math.floor((completed / total) * 100) : 0;

  return {
    progress,
    completedAmount: completed,
    waitingAmount: total - completed,
    overdueAmount: overdue,
  };
};

export default calcProgress;
