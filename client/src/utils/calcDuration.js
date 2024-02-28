// Calculate the duration of a time period
const calcDuration = (start, end) => {
  if ((start, end)) {
    const hoursDiff = end.getHours() - start.getHours();
    const minutesDiff = end.getMinutes() - start.getMinutes();
    return hoursDiff * 60 + minutesDiff;
  } else {
    return 0;
  }
};

export default calcDuration;
