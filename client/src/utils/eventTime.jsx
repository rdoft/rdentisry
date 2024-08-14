import calcDuration from "./calcDuration";

/**
 * Convert start and end date to startTime, endTime thats are time of 0
 * And calculate duration
 * @param {Date} start
 * @param {Date} end
 * @param {Object} event
 * @returns {Object} startTime, endTime, duration
 */
function getEventTime({ start, end }) {
  const date = new Date(
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  );
  const startTime = new Date(0);
  const endTime = new Date(0);
  startTime.setHours(start.getHours());
  startTime.setMinutes(start.getMinutes());
  endTime.setHours(end.getHours());
  endTime.setMinutes(end.getMinutes());
  const duration = calcDuration(startTime, endTime);

  return {
    date,
    startTime,
    endTime,
    duration,
  };
}

/**
 * Convert startTime, endTime to start and end date thats are time of today
 * @param {String} date
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {Object} event
 * @returns start, end, and other properties
 */
function setEventTime({ date, startTime, endTime, ...event }) {
  const year = date instanceof Date ? date.getFullYear() : date.slice(0, 4);
  const month = date instanceof Date ? date.getMonth() + 1 : date.slice(5, 7);
  const day = date instanceof Date ? date.getDate() : date.slice(8, 10);
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);

  start.setFullYear(year);
  start.setMonth(month - 1);
  start.setDate(day);

  end.setFullYear(year);
  end.setMonth(month - 1);
  end.setDate(day);

  return {
    date,
    start,
    end,
    ...event,
  };
}

export { getEventTime, setEventTime };
