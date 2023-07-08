import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import appointment from "services/appointment.service";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { AppointmentService } from "services/index";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
import { Grid, Typography } from "@mui/material";
import CalendarToolbar from "components/Calendar/CalendarToolbar";
import moment from "moment";

// assets
import { ClockCircleOutlined, UserOutlined, FileTextOutlined} from "@ant-design/icons";

require("moment/locale/tr.js");
const localizer = momentLocalizer(moment);

const messages = {
  today: "Bugün",
  previous: "Önceki",
  next: "Sonraki",
  month: "Ay",
  week: "Hafta",
  day: "Gün",
  agenda: "Ajanda",
  date: "Tarih",
  time: "Saat",
  event: "Açıklama",
  noEventsInRange: "Bu tarih aralığında etkinlik bulunmuyor.",
  showMore: "Daha fazla göster",
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

function convertDataArray(dataArray) {
  const convertedEvents = dataArray.map((data) => {
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

    return {
      // title: (
      //   <p>
      //     {`${name} ${surname}`}<br/>{`${description}`}
      //   </p>
      // ),
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
          <Typography
            variant="h5"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            }}
          >
            <UserOutlined /> {`${name} ${surname}`}
          </Typography>
          <Typography
            variant="h6"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            }}
          >
            <FileTextOutlined /> {`${description}`}
          </Typography>
        </div>
      ),
      start: startDate,
      end: endDate,
      id,
    };
  });

  return convertedEvents;
}

const Index = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const saveAppointment = async (appointment) => {
    try {
      if (appointment.id) {
        await AppointmentService.updateAppointment(currentAppId, appointment);
        toast.success("Randevu bilgileri başarıyla güncellendi!");
      } else {
        await AppointmentService.saveAppointment(appointment);
        toast.success("Yeni randevu başarıyla kaydedildi!");
      }
      setAppointmentDialog(false);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setCurrentAppId(null);
    setCurrentAppointment(null);
    setAppointmentDialog(false);
  };

  const showAppointmentDialog = () => {
    setAppointmentDialog(true);
  };

  const handleEventSelection = (e) => {
    setCurrentAppId(e.id);
    setTimeout(showAppointmentDialog, 100);
  };

  useEffect(() => {
    (async () => {
      const response = await appointment.getAppointments();

      const convertedResponse = convertDataArray(response.data);

      setAllEvents(convertedResponse);
    })();
  }, [appointmentDialog]);

  useEffect(() => {
    currentAppId &&
      (async () => {
        const response = await appointment.getAppointment(currentAppId);

        setCurrentAppointment(response.data);
      })();
  }, [currentAppId]);

  const today = new Date();

  return (
    <Grid container rowSpacing={4} columnSpacing={2.75}>
      <Grid item xs={12}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CalendarToolbar onClickAdd={showAppointmentDialog} />
          <Calendar
            messages={messages}
            localizer={localizer}
            events={allEvents}
            defaultView={"week"}
            startAccessor={"start"}
            endAccessor={"end"}
            step={7.5}
            onSelectEvent={handleEventSelection}
            style={{
              height: "calc(100vh - 240px)",
              marginTop: "20px",
            }}
            min={
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                8
              )
            }
            max={
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                23
              )
            }
          />
          {appointmentDialog && (
            <AppointmentDialog
              _appointment={currentAppointment}
              onHide={hideAppointmentDialog}
              onSubmit={saveAppointment}
            />
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Index;
