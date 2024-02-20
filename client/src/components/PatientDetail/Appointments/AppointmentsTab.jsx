import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { AppointmentDialog } from "components/Dialog";
import CardTitle from "components/cards/CardTitle";
import NotFoundText from "components/NotFoundText";
import AppointmentCard from "./AppointmentCard";

// assets
import "assets/styles/PatientDetail/AppointmentsTab.css";

// services
import { AppointmentService } from "services";

function AppointmentsTab({
  patient,
  patients,
  appointmentDialog,
  setPatients,
  showDialog,
  hideDialog,
  getCounts,
}) {
  const navigate = useNavigate();

  // Set the default values
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [doctors, setDoctors] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    AppointmentService.getAppointments({ patientId: patient.id }, { signal })
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
  }, [navigate, patient, setAppointments]);

  // Divide the appointments based on its status
  let activeAppointments = [];
  let otherAppointments = [];
  for (let appointment of appointments) {
    if (appointment.status === "active") {
      activeAppointments.push(appointment);
    } else {
      otherAppointments.push(appointment);
    }
  }

  // SERVICES -----------------------------------------------------------------
  // Get the list of appointments of the patient and set appointmets value
  const getAppointments = async (patientId) => {
    let response;
    let appointments;

    try {
      response = await AppointmentService.getAppointments({ patientId });
      // appointments = response.data.reverse();
      appointments = response.data;

      setAppointments(appointments);
      getCounts();
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
    const _appointment = appointments.find(
      (appointment) => appointment.id === event.id
    );

    setAppointment(_appointment);
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
        onSubmit={saveAppointment}
      />
    );
  };

  return (
    <>
      <Grid container alignItems="start" justifyContent="space-between" mt={2}>
        {/* Active appointments */}
        <Grid container item md={6} xs={12} justifyContent="center" pr={2}>
          <Grid item xs={1}>
            <CardTitle
              title="Aktif"
              style={{ textAlign: "center", marginY: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
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
        </Grid>

        {/* Other appointments */}
        <Grid container item md={6} xs={12} justifyContent="center" pl={2}>
          <Grid item xs={1}>
            <CardTitle
              title="Diğer"
              style={{ textAlign: "center", marginY: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            {otherAppointments.length === 0 ? (
              <NotFoundText text="Randevu yok" p={3} />
            ) : (
              <DataScroller
                value={otherAppointments}
                itemTemplate={appointmentTemplate}
                rows={10}
              ></DataScroller>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Appointment dialog */}
      {appointmentDialog && (
        <AppointmentDialog
          initAppointment={appointment ? appointment : { patient }}
          doctors={doctors}
          patients={patients}
          setDoctors={setDoctors}
          setPatients={setPatients}
          onHide={handleHideDialog}
          onSubmit={saveAppointment}
          onDelete={appointment && deleteAppointment}
        />
      )}
    </>
  );
}

export default AppointmentsTab;
