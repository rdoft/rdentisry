import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { DataScroller } from "primereact";
import { toastErrorMessage } from "components/errorMesage";
import AppointmentDialog from "components/AppointmentDialog/AppointmentDialog";
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
}) {
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
      appointments = response.data.reverse();

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
      getAppointments(patient.id);
      hideDialog();
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
      getAppointments(patient.id);
      hideDialog();
      setAppointment(null);
    } catch (error) {
      // Set error status and show error toast message
      toast.error(toastErrorMessage(error));
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
