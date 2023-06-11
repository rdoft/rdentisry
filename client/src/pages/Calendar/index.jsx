import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import appointment from "services/appointment.service";

const locales = {
  tr: require("date-fns/locale/tr"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Big Meeting",
    allDay: true,
    start: new Date(2023, 6, 19),
    end: new Date(2023, 6, 19),
  },
  {
    title: "Vacation",
    start: new Date(2023, 6, 19),
    end: new Date(2023, 6, 19),
  },
  {
    title: "Conference",
    start: new Date(2023, 6, 19),
    end: new Date(2023, 6, 19),
  },
];

function convertDataArray(dataArray) {
  const convertedEvents = dataArray.map((data) => {
    const { date, description, startTime, endTime } = data;

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
      title: description,
      start: startDate,
      end: endDate,
    };
  });

  return convertedEvents;
}

const Index = () => {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await appointment.getAppointments();

      const convertedResponse = convertDataArray(response.data);

      setAllEvents(convertedResponse);
    })();
  }, []);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: "calc(100vh - 200px)", margin: "50px" }}
      />
    </div>
  );
};

export default Index;
