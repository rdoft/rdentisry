import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller, ConfirmDialog, confirmDialog } from "primereact";
import { toastErrorMessage } from "components/errorMesage";
import AppointmentCard from "./AppointmentCard";
import DialogFooter from "components/DialogFooter/DialogFooter";

// assets
import "assets/styles/PatientDetail/AppointmentsTab.css";

// services
import { AppointmentService } from "services/index";

function AppointmentsTab({ patientId }) {
  // Set the default values
  const [appointments, setAppointments] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [otherAppointments, setOtherAppointments] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
      appointments = response.data.reverse();

      setAppointments(appointments);
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
    } catch (error) {
      // Set error status and show error toast message
      toast.error(toastErrorMessage(error));
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onHide handler
  const handleHide = () => {
    setAppointment(null);
    setShowConfirmDialog(false);
  };

  // onDelete handler
  const handleDelete = () => {
    deleteAppointment(appointment);
    setAppointment(null);
    setShowConfirmDialog(false);
  };

  // Confirmation dialog in order to delete
  const handleDeleteConfim = (appointment) => {
    setAppointment(appointment);
    setShowConfirmDialog(true);
    confirmDialog({
      message: "Randevuyu silmek istediğinizden emin misiniz?",
      header: "Randevuyu Sil",
      footer: <DialogFooter onDelete={handleDelete} onHide={handleHide} />,
    });
  };

  // TEMPLATES ----------------------------------------------------------------
  const appointmentTemplate = (appointment) => {
    if (!appointment) {
      return;
    }
    return (
      <AppointmentCard
        appointment={appointment}
        onDelete={handleDeleteConfim}
      />
    );
  };

  return (
    <>
      <ConfirmDialog visible={showConfirmDialog} />
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
    </>
  );
}

export default AppointmentsTab;
