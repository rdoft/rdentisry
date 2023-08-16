import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Grid } from "@mui/material";
import { TabView, TabPanel } from "primereact";

import { toastErrorMessage } from "components/errorMesage";
import PatientDetailToolbar from "./PatientDetailToolbar";

// services
import { PatientService } from "services/index";

const PatientDetail = () => {
  // Set the default values
  const [patient, setPatient] = useState(null);
  const query = useParams();
  const { id } = query;

  // Set the page on loading
  useEffect(() => {
    getPatient(id);
  }, [id]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
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
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <div>
          <PatientDetailToolbar
            name={patient?.name}
            surname={patient?.surname}
            phone={patient?.phone}
          />

          <TabView>
            <TabPanel header="Randevular">
              
            </TabPanel>
            <TabPanel header="Ödemeler">
              
            </TabPanel>
            <TabPanel header="Tedaviler">
              
            </TabPanel>
            <TabPanel header="Notlar">
              
            </TabPanel>
            <TabPanel header="Dökümanlar">
              
            </TabPanel>
          </TabView>
        </div>
      </Grid>
    </Grid>
  );
};

export default PatientDetail;
