import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { TabView, TabPanel } from "primereact";
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

  return (
    id && (
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
          <div>
            <PatientDetailToolbar patient={patient} />

            <TabView>
              <TabPanel header="Randevular">
                <AppointmentsTab patientId={id} />
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
