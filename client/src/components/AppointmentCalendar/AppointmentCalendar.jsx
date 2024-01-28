import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { activeItem } from "store/reducers/menu";
import convert from "components/AppointmentCalendar/CalendarEvent";
import CalendarToolbar from "components/AppointmentCalendar/CalendarToolbar";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";

// assets
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// services
import { AppointmentService } from "services";

require("moment/locale/tr.js");
const localizer = momentLocalizer(moment);
const today = new Date();

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const PAGE_PATIENTS = "patients";

  // Set the default values
  const [step, setStep] = useState(30);
  const [events, setEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    getAppointments();
  }, [doctor]);

  useEffect(() => {
    getEvents();
  }, [appointments, step, showAll]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of appointments and set appointmets value
  const getAppointments = async () => {
    let response;
    let appointments;

    try {
      response = await AppointmentService.getAppointments({
        doctorId: doctor?.id,
      });
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
    navigate(`/${PAGE_PATIENTS}/${event.patient.id}`);
    dispatch(activeItem({ openItem: [PAGE_PATIENTS] }));
  };

  // TEMPLATES -----------------------------------------------------------------
  // Convert appointment format to events
  // And filter only active appointments if "show all" not selected
  const getEvents = () => {
    let events;
    let appointments_;

    appointments_ = showAll
      ? appointments
      : appointments.filter((appointment) => appointment.status === "active");
    events = appointments_.map((appointment) =>
      convert(appointment, step, handleClickEdit)
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
      <CalendarToolbar
        doctor={doctor}
        showAll={showAll}
        setDoctor={setDoctor}
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
        components={{
          header: header,
        }}
        views={["month", "week"]}
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
          _appointment={{ doctor, ...appointment }}
          onHide={hideAppointmentDialog}
          onSubmit={saveAppointment}
          onDelete={appointment && deleteAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;
