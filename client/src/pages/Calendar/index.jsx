import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import appointment from "services/appointment.service";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { AppointmentService } from "services/index";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
import { Button } from "primereact";

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

function convertDataArray(dataArray) {
  const convertedEvents = dataArray.map((data) => {
    const { date, description, startTime, endTime } = data;
    const { Name } = data.patient;

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
      title: `${Name} - ${description}`,
      start: startDate,
      end: endDate,
    };
  });

  return convertedEvents;
}

const Index = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);

  // save appointment
  const saveAppointment = async (appointment) => {
    try {
      await AppointmentService.saveAppointment(appointment);
      setAppointmentDialog(false);
      toast.success("Yeni randevu başarıyla oluşturuldu!");
    } catch (error) {
      toast.erorr(toastErrorMessage(error));
    }
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setAppointmentDialog(false);
  };

  const showAppointmentDialog = () => {
    setAppointmentDialog(true);
  };

  useEffect(() => {
    (async () => {
      const response = await appointment.getAppointments();

      const convertedResponse = convertDataArray(response.data);

      setAllEvents(convertedResponse);
    })();
  }, [appointmentDialog]);

  const today = new Date();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ alignSelf: "end", paddingRight: "50px" }}>
        <Button
          onClick={showAppointmentDialog}
          label="Randevu oluştur"
          className="p-button p-button-info"
        />
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: "calc(100vh - 200px)", margin: "50px" }}
        min={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)
        }
        max={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)
        }
      />
      {appointmentDialog && (
        <AppointmentDialog
          onHide={hideAppointmentDialog}
          onSubmit={saveAppointment}
        />
      )}
    </div>
  );
};

export default Index;
