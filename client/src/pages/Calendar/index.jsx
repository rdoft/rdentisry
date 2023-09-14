import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { Grid, Typography } from "@mui/material";
import { AppointmentService } from "services";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
import CalendarToolbar from "components/Calendar/CalendarToolbar";
import moment from "moment";

// assets
import {
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

require("moment/locale/tr.js");
const localizer = momentLocalizer(moment);

const today = new Date();

const messages = {
  today: "Bugün",
  previous: <LeftOutlined />,
  next: <RightOutlined />,
  month: "Ay",
  week: "Hafta",
  day: "Gün",
  agenda: "Ajanda",
  date: "Tarih",
  time: "Saat",
  event: "Randevu",
  noEventsInRange: "Bu tarih aralığında etkinlik bulunmuyor.",
  showMore: (total) => `+${total} daha`,
  allDay: "Tüm gün",
  dateHeaderFormat: "dddd, DD MMMM YYYY",
  dayRangeHeaderFormat: "DD MMMM YYYY",
  monthHeaderFormat: "MMMM YYYY",
  dayHeaderFormat: "dddd",
  timeGutterFormat: "H:mm",
  dayFormat: "DD",
  dateFormat: "DD MMMM YYYY",
  monthFormat: "MMMM",
  yearFormat: "YYYY",
};

const formats = {
  agendaDateFormat: (date, culture, localizer) =>
    date.toLocaleDateString("tr-TR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
};

const convertToEvent = (appointments, step) => {
  const convertedEvents = appointments.map((data) => {
    const { date, description, startTime, endTime, id } = data;
    const { name, surname } = data.patient;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const startHours = startDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endHours = endDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);

    startDate.setFullYear(year);
    startDate.setMonth(month - 1);
    startDate.setDate(day);

    endDate.setFullYear(year);
    endDate.setMonth(month - 1);
    endDate.setDate(day);

    const showName = data.duration >= step;
    const showDescription = description && data.duration >= (step / 3) * 4;

    return {
      title: (
        <div>
          <Typography
            variant="h6"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            }}
          >
            <ClockCircleOutlined /> {`${startHours}-${endHours}`}
          </Typography>
          {showName && (
            <Typography
              variant="h5"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              }}
            >
              <UserOutlined /> {`${name} ${surname}`}
            </Typography>
          )}

          {showDescription && (
            <Typography
              variant="h6"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                whiteSpace: "pre-wrap",
              }}
            >
              <FileTextOutlined />{" "}
              {description.includes("\n") ||
              description.split(/\n/)[0].length > 24
                ? description.split(/\n/)[0].slice(0, 24) + " ..."
                : description.split(/\n/)[0]}
            </Typography>
          )}
        </div>
      ),
      start: startDate,
      end: endDate,
      id,
      tooltip: `${name} ${surname}`,
    };
  });

  return convertedEvents;
};

const header = ({ label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ position: "relative" }}>
      <div>
        <p>{label}</p>
      </div>
    </div>
  </div>
);

const dayPropGetter = (date) => ({
  ...(today.toLocaleDateString() === date.toLocaleDateString() && {
    style: {
      backgroundColor: "#EBEFF4",
      // color: "white",
    },
  }),
});

const Index = () => {
  const [step, setState] = useState(30);
  const [events, setEvents] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    const events = convertToEvent(appointments, step);
    setEvents(events);
  }, [appointments, step]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of appointments and set appointmets value
  const getAppointments = async () => {
    let response;
    let appointments;

    try {
      response = await AppointmentService.getAppointments();
      appointments = response.data;

      setAppointments(appointments);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // Save appointment (create/update)
  const saveAppointment = async (appointment) => {
    try {
      if (appointment.id) {
        await AppointmentService.updateAppointment(appointment.id, appointment);
        toast.success("Randevu bilgileri başarıyla güncellendi!");
      } else {
        await AppointmentService.saveAppointment(appointment);
        toast.success("Yeni randevu başarıyla kaydedildi!");
      }

      // Get and set the updated list of appointments
      getAppointments();
      setAppointmentDialog(false);
      setAppointment(null);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  //  Delete appointment
  const deleteAppointment = async (appointment) => {
    try {
      await AppointmentService.deleteAppointment(appointment.id);

      // Get and set the updated list of appointments
      getAppointments();
      setAppointmentDialog(false);
      setAppointment(null);
    } catch (error) {
      // Set error status and show error toast message
      toast.error(toastErrorMessage(error));
    }
  };

  // SHOW/HIDE OPTIONS --------------------------------------------------------
  // Show add appointment dialog
  const showAppointmentDialog = () => {
    setAppointmentDialog(true);
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setAppointment(null);
    setAppointmentDialog(false);
  };

  // HANDLERS -----------------------------------------------------------------
  // onSelectEvent, get appointment and show dialog
  const handleSelectEvent = async (event) => {
    const appointment_ = appointments.find(
      (appointment) => appointment.id === event.id
    );
    setAppointment(appointment_);

    setTimeout(showAppointmentDialog, 100);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <div>
          <CalendarToolbar onClickAdd={showAppointmentDialog} />
          <Calendar
            style={{
              height: "calc(100vh - 190px)",
              // marginTop: "20px",
            }}
            messages={messages}
            localizer={localizer}
            events={events}
            dayPropGetter={dayPropGetter}
            components={{
              header: header,
              // toolbar: header
            }}
            views={["month", "week", "agenda"]}
            defaultView={"week"}
            startAccessor={"start"}
            endAccessor={"end"}
            timeslots={1}
            step={step}
            tooltipAccessor={(event) => event.tooltip}
            showAllEvents={true}
            length="7"
            allDayAccessor={null}
            min={
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                9
              )
            }
            max={
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                22
              )
            }
            formats={formats}
            onSelectEvent={handleSelectEvent}
          />
          {appointmentDialog && (
            <AppointmentDialog
              _appointment={appointment}
              onHide={hideAppointmentDialog}
              onSubmit={saveAppointment}
              onDelete={appointment && deleteAppointment}
            />
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Index;
