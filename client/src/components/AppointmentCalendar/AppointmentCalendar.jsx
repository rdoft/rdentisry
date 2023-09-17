import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
import CalendarToolbar from "components/AppointmentCalendar/CalendarToolbar";
import convert from "components/AppointmentCalendar/CalendarEvent";

// assets
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// services
import { AppointmentService } from "services";

require("moment/locale/tr.js");
const localizer = momentLocalizer(moment);
const today = new Date();

const AppointmentCalendar = () => {
  const navigate = useNavigate();

  // Set the default values
  const [step, setStep] = useState(30);
  const [events, setEvents] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    getEvents();
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
  // const handleSelectEvent = async (event) => {
  //   const appointment_ = appointments.find(
  //     (appointment) => appointment.id === event.id
  //   );
  //   setAppointment(appointment_);

  //   setTimeout(showAppointmentDialog, 100);
  // };
  
  // onSelectEvent handler for goto patient page
  const handleSelectEvent = async (event) => {
    navigate(`/patients/${event.patient.id}`);
  };
  
  // TEMPLATES -----------------------------------------------------------------
  // Convert appointment format to events
  const getEvents = () => {
    const events = appointments.map((appointment) =>
      convert(appointment, step)
    );
    setEvents(events);
  };

  // header of the calendar
  const header = ({ label }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative" }}>
        <div>
          <p>{label}</p>
        </div>
      </div>
    </div>
  );

  // Style the today background
  const dayPropGetter = (date) => ({
    ...(today.toLocaleDateString() === date.toLocaleDateString() && {
      style: {
        backgroundColor: "#EBEFF4",
      },
    }),
  });

  // Set the date formatting
  const formats = {
    agendaDateFormat: (date, culture, localizer) =>
      date.toLocaleDateString("tr-TR", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
  };

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

  return (
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
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9)
        }
        max={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22)
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
  );
};

export default AppointmentCalendar;
