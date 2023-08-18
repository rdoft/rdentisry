import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { toastErrorMessage } from "components/errorMesage";
import AppointmentCard from "./AppointmentCard";

// assets
import "assets/styles/PatientDetail/AppointmentsTab.css";

// services
import { AppointmentService } from "services/index";
import { Divider } from "../../../node_modules/@mui/material/index";

function AppointmentsTab({ patientId }) {
  // Set the default values
  const [appointments, setAppointments] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [otherAppointments, setOtherAppointments] = useState([]);

  // Set the page on loading
  useEffect(() => {
    getAppointments(patientId);
  }, [patientId]);

  // Set the active-other appointments
  useEffect(() => {
    divideAppointments(appointments);
  }, [appointments]);

  // Divide the appointments based on its status
  const divideAppointments = (appointments) => {
    let activeList = [];
    let otherList = [];

    appointments.map((appointment) => {
      if (appointment.status === "active") {
        activeList.push(appointment);
      } else {
        otherList.push(appointment);
      }
    });

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
      appointments = response.data;

      setAppointments(appointments);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // TEMPLATES ----------------------------------------------------------------
  const appointmentTemplate = (appointment) => {
    if (!appointment) {
      return;
    }

    return <AppointmentCard appointment={appointment} />;
  };

  return (
    <Grid container justifyContent="space-between">
      <Grid item md={6} xs={12}>
        <DataScroller
          value={activeAppointments}
          itemTemplate={appointmentTemplate}
          rows={10}
          header="Aktif"
          emptyMessage="Randevu bulunamadı"
        ></DataScroller>
      </Grid>
      <Grid item md={6} xs={12}>
        <DataScroller
          value={otherAppointments}
          itemTemplate={appointmentTemplate}
          rows={10}
          header="Diğer"
          emptyMessage="Randevu bulunamadı"
        ></DataScroller>
      </Grid>
    </Grid>
  );
}

export default AppointmentsTab;
