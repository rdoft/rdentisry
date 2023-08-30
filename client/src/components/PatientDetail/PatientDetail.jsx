import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { TabView, TabPanel, Button } from "primereact";
import { Grid } from "@mui/material";
import PatientDetailToolbar from "./PatientDetailToolbar";
import AppointmentsTab from "./AppointmentsTab";

// assets
import "assets/styles/PatientDetail/PatientDetail.css";

// services
import { PatientService } from "services/index";

function PatientDetail() {
  let { id } = useParams();
  id = Number.isInteger(parseInt(id)) ? parseInt(id) : null;

  // Set the default values
  const [patient, setPatient] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [appointmentDialog, setAppointmentDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    id && getPatient(id);
  }, [id]);

  // SERVICES -----------------------------------------------------------------
  // Get the patient info and set patient value
  const getPatient = async (id) => {
    let response;
    let patient;

    try {
      // GET /patients
      response = await PatientService.getPatient(id);
      patient = response.data;

      // Set new patients
      setPatient(patient);
    } catch (error) {
      // Set error status and show error toast message
      toast.error(toastErrorMessage(error));
    }
  };

  // SHOW/HIDE OPTIONS --------------------------------------------------------
  // Show add appointment dialog
  const showAppointmentDialog = () => {
    setAppointmentDialog(true);
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setAppointmentDialog(false);
  };

  // HANDLERS -----------------------------------------------------------------
  const handleTabChange = (event) => {
    setActiveIndex(event.index);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Toolbar action template
  const getActionTemplate = () => {
    switch (activeIndex) {
      case 0:
        return (
          <Button
            label="Randevu Ekle"
            icon="pi pi-plus"
            className="p-button-text p-button-info"
            onClick={showAppointmentDialog}
          />
        );
      case 1:
        return null;
      case 2:
        return null;
      case 3:
        return null;
      case 4:
        return null;
      default:
        return null;
    }
  };

  return (
    patient && (
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
          <div>
            <PatientDetailToolbar
              patient={patient}
              actionTemplate={getActionTemplate}
            />

            <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
              <TabPanel header="Randevular">
                <AppointmentsTab
                  patient={patient}
                  appointmentDialog={appointmentDialog}
                  showDialog={showAppointmentDialog}
                  hideDialog={hideAppointmentDialog}
                />
              </TabPanel>
              <TabPanel header="Ödemeler"></TabPanel>
              <TabPanel header="Tedaviler"></TabPanel>
              <TabPanel header="Notlar"></TabPanel>
              <TabPanel header="Dökümanlar"></TabPanel>
            </TabView>
          </div>
        </Grid>
      </Grid>
    )
  );
}

export default PatientDetail;
