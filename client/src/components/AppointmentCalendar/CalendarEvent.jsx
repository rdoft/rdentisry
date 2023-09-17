import React from "react";
import EventTitle from "./EventTitle";

function convert(event, step, onClickEdit) {
  const { date, startTime, endTime, id, patient } = event;
  const { name, surname } = event.patient;

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
    title: <EventTitle event={event} step={step} onClickEdit={onClickEdit} />,
    start: startDate,
    end: endDate,
    tooltip: `${name} ${surname}`,
    patient,
    id,
  };
}

export default convert;
