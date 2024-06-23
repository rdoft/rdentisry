function setEvent(event) {
  const { date, startTime, endTime } = event;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  startDate.setFullYear(year);
  startDate.setMonth(month - 1);
  startDate.setDate(day);

  endDate.setFullYear(year);
  endDate.setMonth(month - 1);
  endDate.setDate(day);

  return {
    start: startDate,
    end: endDate,
    ...event,
  };
}

export default setEvent;
