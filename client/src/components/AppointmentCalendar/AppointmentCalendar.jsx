import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { AppointmentDialog } from "components/Dialog";
import { setEvent } from "utils";
import moment from "moment";
import DayHeader from "./DayHeader";
import Event from "./Event";
import CalendarToolbar from "./CalendarToolbar";

// assets
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "assets/styles/AppointmentCalendar/AppointmentCalendar.css";

// services
import { AppointmentService } from "services";

require("moment/locale/tr.js");
const localizer = momentLocalizer(moment);
const today = new Date();

const AppointmentCalendar = () => {
  const navigate = useNavigate();

  // Set the default values
  const step = useRef(30);
  // const [step, setStep] = useState(30);
  const [showAll, setShowAll] = useState(
    localStorage.getItem("showAllAppointment") === "true"
  );
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [doctors, setDoctors] = useState(null);
  const [patients, setPatients] = useState(null);
  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem("doctor")) || null
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AppointmentService.getAppointments({}, { signal })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate]);

  // And filter only active appointments if "show all" not selected
  // And filter by doctor if doctor selected
  const filteredAppointments = appointments.filter(
    (appointment) =>
      (!doctor || appointment.doctor.id === doctor?.id) &&
      (showAll || appointment.status === "active")
  );

  // SERVICES -----------------------------------------------------------------
  // Get the list of appointments and set appointmets value
  const getAppointments = async () => {
    let response;
    let appointments;

    try {
      response = await AppointmentService.getAppointments({});
      appointments = response.data;
      setAppointments(appointments);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // Show add appointment dialog
  const showAppointmentDialog = () => {
    setAppointmentDialog(true);
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setAppointment(null);
    setAppointmentDialog(false);
  };

  // onEditClick, get appointment and show dialog
  const handleClickEdit = async (id) => {
    const appointment_ = appointments.find(
      (appointment) => appointment.id === id
    );
    setAppointment(appointment_);
    setTimeout(showAppointmentDialog, 100);
  };

  // onSelectEvent handler for goto patient page
  const handleSelectEvent = async (event) => {
    handleClickEdit(event.id);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Style the today background
  const dayPropGetter = (date) => ({
    ...(today.toLocaleDateString() === date.toLocaleDateString() && {
      style: {
        backgroundColor: "#EBEFF4",
      },
    }),
  });

  // custom components
  const components = {
    header: ({ date, label }) => <DayHeader date={date} label={label} />,
    event: ({ event }) => <Event event={event} step={step.current} />,
  };

  // Set the date formatting
  const formats = {
    agendaDateFormat: (date, culture, localizer) =>
      date.toLocaleDateString("tr-TR", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    dayFormat: (date, culture, localizer) =>
      localizer.format(date, `DD dddd`, culture),
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, "dddd", culture),
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      end.getMonth() !== start.getMonth()
        ? `${localizer.format(start, "MMMM", culture)} - ${localizer.format(
            end,
            "MMMM",
            culture
          )}`
        : localizer.format(start, "MMMM", culture),
  };

  // Set the messages
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

  // Convert appointments format to events
  const events = filteredAppointments.map((appointment) =>
    setEvent(appointment, step.current)
  );

  return (
    <>
      <CalendarToolbar
        showAll={showAll}
        doctor={doctor}
        doctors={doctors}
        setDoctor={setDoctor}
        setDoctors={setDoctors}
        setShowAll={setShowAll}
        onClickAddAppointment={showAppointmentDialog}
      />
      <Calendar
        style={{
          height: "calc(100vh - 190px)",
          // marginTop: "20px",
        }}
        messages={messages}
        localizer={localizer}
        events={events}
        dayPropGetter={dayPropGetter}
        components={components}
        tooltipAccessor={null}
        views={["month", "week"]}
        defaultView={"week"}
        startAccessor={"start"}
        endAccessor={"end"}
        timeslots={1}
        step={step.current}
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
          initAppointment={{ doctor, ...appointment }}
          doctors={doctors}
          patients={patients}
          setDoctors={setDoctors}
          setPatients={setPatients}
          onHide={hideAppointmentDialog}
          onSubmit={saveAppointment}
          onDelete={appointment && deleteAppointment}
        />
      )}
    </>
  );
};

export default AppointmentCalendar;
