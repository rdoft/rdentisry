import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "primereact";
import { Typography } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { getEventTime, setEventTime } from "utils";
import { AppointmentDialog } from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { CalendarToolbar } from "components/Toolbar";
import { useLoading } from "context/LoadingProvider";
import { Loader } from "components/Loadable";
import moment from "moment";
import Event from "./Event";
import MonthEvent from "./MonthEvent";
import DayHeader from "./DayHeader";
import TimeGutter from "./TimeGutter";
import TimeGutterHeader from "./TimeGutterHeader";

// assets
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useTheme } from "@mui/material/styles";
import "assets/styles/AppointmentCalendar/AppointmentCalendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// services
import { AppointmentService } from "services";

require("moment/locale/tr.js");
const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);
const today = new Date();

const AppointmentCalendar = () => {
  const theme = useTheme();
  const { loading, startLoading, stopLoading } = useLoading();

  const step = useRef(30);
  const timeslots = useRef(2);

  // const [step, setStep] = useState(30);
  const [resizable, setResizable] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [patients, setPatients] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem("doctor")) || null
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("AppointmentCalendar");
    AppointmentService.getAppointments({}, { signal })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("AppointmentCalendar"));

    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // Filter appointments by doctor if doctor selected and only non-canceled appointments
  const filteredAppointments = appointments.filter(
    (appointment) =>
      (!doctor || appointment.doctor?.id === doctor?.id) &&
      appointment.status !== "canceled"
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
      error.message && toast.error(error.message);
    }
  };

  // Save appointment (create/update)
  const saveAppointment = async (appointment) => {
    try {
      startLoading("save");
      if (appointment.id) {
        await AppointmentService.updateAppointment(appointment.id, appointment);
      } else {
        await AppointmentService.saveAppointment(appointment);
      }
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      // Get and set the list of appointments
      await getAppointments();
      hideAppointmentDialog();
      stopLoading("save");
    }
  };

  //  Delete appointment
  const deleteAppointment = async (appointment) => {
    try {
      startLoading("delete");
      await AppointmentService.deleteAppointment(appointment.id);

      // Get and set the updated list of appointments
      await getAppointments();
      hideAppointmentDialog();
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
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

  // onView handler for set view
  const handleView = (view) => {
    setResizable(view !== "month");
  };

  // onSelectSlot handler for add new appointment
  const handleSelectSlot = ({ start, end, action }) => {
    if (action === "select" || action === "click") {
      // Set date, start-end time and duration
      const { date, startTime, endTime, duration } = getEventTime({
        start,
        end,
      });
      setAppointment({
        doctor,
        date,
        startTime,
        endTime,
        duration,
      });
      showAppointmentDialog();
    }
  };

  // onEventResize handler for update appointment
  const handleResizeEvent = async ({ event, start, end }) => {
    // Set start-end time and duration
    const { date, startTime, endTime, duration } = getEventTime({ start, end });
    // Add temp event to appointments
    setAppointments((prev) => [
      ...prev.map((appointment) =>
        appointment.id === event.id
          ? {
              temp: true,
              date: date,
              startTime: startTime,
              endTime: endTime,
            }
          : appointment
      ),
    ]);
    saveAppointment({
      ...event,
      startTime,
      endTime,
      duration,
    });
  };

  // onEventDrop handler for update appointment
  const handleDropEvent = async ({ event, start, end }) => {
    // Set date, start-end time and duration
    const { date, startTime, endTime, duration } = getEventTime({ start, end });
    // Add temp event to appointments
    setAppointments((prev) => [
      ...prev.map((appointment) =>
        appointment.id === event.id
          ? {
              temp: true,
              date: date,
              startTime: startTime,
              endTime: endTime,
            }
          : appointment
      ),
    ]);
    // Save appointment
    saveAppointment({
      ...event,
      date,
      startTime,
      endTime,
      duration,
    });
  };

  // Show delete confirmation dialog
  const showDeleteDialog = (appointment) => {
    setAppointment(appointment);
    setDeleteDialog(true);
  };

  // Hide delete confirmation dialog
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
    setAppointment(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (appointment) {
      await deleteAppointment(appointment);
      hideDeleteDialog();
    }
  };

  // TEMPLATES -----------------------------------------------------------------
  // Style the today background
  const dayPropGetter = (date) => ({
    ...(today.toLocaleDateString() === date.toLocaleDateString() && {
      style: {
        backgroundColor: theme.palette.background.default,
      },
    }),
  });

  // Create toolbar component with useCallback
  const toolbar = useCallback(
    (toolbarProps) => (
      <CalendarToolbar
        {...toolbarProps}
        doctor={doctor}
        doctors={doctors}
        setDoctor={setDoctor}
        setDoctors={setDoctors}
      />
    ),
    [doctor, doctors, setDoctor, setDoctors]
  );

  // Custom components
  const components = {
    toolbar: toolbar,
    header: DayHeader,
    timeGutterHeader: TimeGutterHeader,
    timeGutterWrapper: TimeGutter,
    event: ({ event }) => (
      <Event
        key={`${event.id}-${event.patient?.id}-${event.doctor?.id}`}
        initEvent={event}
        step={step.current}
        onSubmit={saveAppointment}
        onDelete={showDeleteDialog}
      />
    ),
    month: {
      event: ({ event }) => (
        <MonthEvent
          key={`${event.id}-${event.patient?.id}-${event.doctor?.id}`}
          initEvent={event}
          onSubmit={saveAppointment}
          onDelete={showDeleteDialog}
        />
      ),
    },
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
    setEventTime(appointment, step.current)
  );

  return (
    <>
      {/* Loading */}
      {Object.values(loading).some((value) => value === true) && <Loader />}

      <DnDCalendar
        key={doctors ? doctors.length : 0}
        style={{
          height: "calc(100vh - 65px)",
        }}
        messages={messages}
        localizer={localizer}
        events={events}
        dayPropGetter={dayPropGetter}
        components={components}
        tooltipAccessor={null}
        views={["month", "week", "day"]}
        defaultView={"week"}
        startAccessor={"start"}
        endAccessor={"end"}
        timeslots={timeslots.current}
        step={step.current / timeslots.current}
        showAllEvents
        selectable
        length="7"
        allDayAccessor={null}
        min={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9)
        }
        max={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22)
        }
        formats={formats}
        resizable={resizable}
        onView={handleView}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onEventResize={handleResizeEvent}
        onEventDrop={handleDropEvent}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        visible={deleteDialog}
        onHide={hideDeleteDialog}
        message={
          <Typography variant="body1">
            <strong>
              {appointment?.patient?.name} {appointment?.patient?.surname}
            </strong>{" "}
            isimli hastanın randevusunu silmek istediğinizden emin misiniz?
          </Typography>
        }
        header="Randevuyu Sil"
        footer={
          <DialogFooter
            onHide={hideDeleteDialog}
            onDelete={handleDeleteConfirm}
          />
        }
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
          onDelete={appointment.id && deleteAppointment}
        />
      )}
    </>
  );
};

export default AppointmentCalendar;
