import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { AppointmentDialog } from "components/Dialog";
import { CardTitle } from "components/cards";
import { NewItem } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { LoadingController } from "components/Loadable";
import { SkeletonAppointmentsTab } from "components/Skeleton";

import NotFoundText from "components/Text/NotFoundText";
import AppointmentCard from "./AppointmentCard";

// assets
import { useTheme } from "@mui/material/styles";
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
  counts,
  setCounts,
}) {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();

  // Set the default values
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [doctors, setDoctors] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("AppointmentsTab");
    AppointmentService.getAppointments({ patientId: patient.id }, { signal })
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("AppointmentsTab"));

    return () => {
      controller.abort();
    };
  }, [patient, startLoading, stopLoading]);

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
    let countAppointment = 0;

    try {
      response = await AppointmentService.getAppointments({ patientId });
      // appointments = response.data.reverse();
      response.data.forEach((appointment) => {
        appointment.status === "active" && countAppointment++;
      });
      setAppointments(response.data);
      setCounts({
        ...counts,
        appointment: countAppointment,
      });
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

      // Get and set the updated list of appointments
      await getAppointments(patient.id);
      hideDialog();
      setAppointment(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  //  Delete appointment
  const deleteAppointment = async (appointment) => {
    try {
      startLoading("delete");
      await AppointmentService.deleteAppointment(appointment.id);

      // Get and set the updated list of appointments
      await getAppointments(patient.id);
      hideDialog();
      setAppointment(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
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
    <LoadingController
      name="AppointmentsTab"
      skeleton={<SkeletonAppointmentsTab />}
    >
      <Grid container alignItems="start" justifyContent="space-between" mt={2}>
        {/* Active appointments */}
        <Grid container item md={6} xs={12} justifyContent="center" pr={2}>
          <Grid item xs="auto">
            <CardTitle style={{ textAlign: "center", marginY: 2 }}>
              Aktif
            </CardTitle>
          </Grid>

          <Grid
            item
            xs={12}
            px={1}
            py={3}
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          >
            {activeAppointments.length === 0 ? (
              <NotFoundText
                text="Aktif randevu yok"
                style={{ backgroundColor: theme.palette.background.primary }}
              />
            ) : (
              <DataScroller
                value={activeAppointments}
                itemTemplate={appointmentTemplate}
                rows={10}
              ></DataScroller>
            )}

            {/* Add appointment */}
            <NewItem label="Randevu Ekle" onClick={showDialog} />
          </Grid>
        </Grid>

        {/* Other appointments */}
        <Grid container item md={6} xs={12} justifyContent="center" pl={2}>
          <Grid item xs="auto">
            <CardTitle style={{ textAlign: "center", marginY: 2 }}>
              Diğer
            </CardTitle>
          </Grid>

          <Grid
            item
            xs={12}
            px={1}
            py={3}
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          >
            {otherAppointments.length === 0 ? (
              <NotFoundText
                text="Diğer randevu yok"
                style={{ backgroundColor: theme.palette.background.primary }}
              />
            ) : (
              <DataScroller
                value={otherAppointments}
                itemTemplate={appointmentTemplate}
                rows={10}
              ></DataScroller>
            )}

            {/* Add appointment */}
            <NewItem label="Randevu Ekle" onClick={showDialog} />
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
    </LoadingController>
  );
}

export default AppointmentsTab;
