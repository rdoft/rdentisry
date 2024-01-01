import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { errorHandler } from "utils/errorHandler";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
import NotFoundText from "components/NotFoundText";
import CardTitle from "components/cards/CardTitle";
import AppointmentCard from "./AppointmentCard";

// assets
import "assets/styles/PatientDetail/AppointmentsTab.css";

// services
import { AppointmentService } from "services";

function AppointmentsTab({
  patient,
  appointmentDialog,
  showDialog,
  hideDialog,
  getCounts,
}) {
  const navigate = useNavigate();
  // Set the default values
  const [appointments, setAppointments] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [otherAppointments, setOtherAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null);

  // Set the page on loading
  useEffect(() => {
    getAppointments(patient.id);
  }, [patient]);

  // Set the active-other appointments
  useEffect(() => {
    getCounts();
    divideAppointments(appointments);
  }, [appointments]);

  // Divide the appointments based on its status
  const divideAppointments = (appointments) => {
    let activeList = [];
    let otherList = [];

    for (let appointment of appointments) {
      if (appointment.status === "active") {
        activeList.push(appointment);
      } else {
        otherList.push(appointment);
      }
    }

    // Set values
    setActiveAppointments(activeList);
    setOtherAppointments(otherList);
  };

  // SERVICES -----------------------------------------------------------------
  // Get the list of appointments of the patient and set appointmets value
  const getAppointments = async (patientId) => {
    let response;
    let appointments;

    try {
      response = await AppointmentService.getAppointments(patientId);
      // appointments = response.data.reverse();
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
      getAppointments(patient.id);
      hideDialog();
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
      getAppointments(patient.id);
      hideDialog();
      setAppointment(null);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onSelectEvent, get appointment and show dialog
  const handleSelectAppointment = async (event) => {
    const appointment_ = appointments.find(
      (appointment) => appointment.id === event.id
    );
    setAppointment(appointment_);

    setTimeout(showDialog, 100);
  };

  // onHide handler
  const handleHideDialog = () => {
    setAppointment(null);
    hideDialog();
  };

  // TEMPLATES ----------------------------------------------------------------
  const appointmentTemplate = (appointment) => {
    if (!appointment) {
      return;
    }
    return (
      <AppointmentCard
        appointment={appointment}
        onClickEdit={handleSelectAppointment}
        onChangeStatus={saveAppointment}
      />
    );
  };

  return (
    <>
      <Grid container justifyContent="space-between" mt={2}>
        <Grid container justifyContent="space-around">
          <Grid item xs={1}>
            <CardTitle
              title="Aktif"
              style={{ textAlign: "center", marginY: 2 }}
            />
          </Grid>

          <Grid item xs={1}>
            <CardTitle
              title="Diğer"
              style={{ textAlign: "center", marginY: 2 }}
            />
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} pr={2}>
          {activeAppointments.length === 0 ? (
            <NotFoundText text="Randevu yok" p={3} />
          ) : (
            <DataScroller
              value={activeAppointments}
              itemTemplate={appointmentTemplate}
              rows={10}
            ></DataScroller>
          )}
        </Grid>
        <Grid item md={6} xs={12} pl={2}>
          {otherAppointments.length === 0 ? (
            <NotFoundText text="Randevu yok" p={3} />
          ) : (
            <DataScroller
              value={otherAppointments}
              itemTemplate={appointmentTemplate}
              rows={10}
              emptyMessage={<NotFoundText text="Randevu yok" p={0} />}
              style={{ textAlign: "center" }}
            ></DataScroller>
          )}
        </Grid>
      </Grid>
      {appointmentDialog && (
        <AppointmentDialog
          _appointment={appointment ? appointment : { patient }}
          onHide={handleHideDialog}
          onSubmit={saveAppointment}
          onDelete={appointment && deleteAppointment}
        />
      )}
    </>
  );
}

export default AppointmentsTab;
