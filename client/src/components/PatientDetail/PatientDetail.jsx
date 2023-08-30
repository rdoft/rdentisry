import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { TabView, TabPanel, Button } from "primereact";
import { Grid } from "@mui/material";
import PatientDetailToolbar from "./PatientDetailToolbar";
import AppointmentsTab from "./AppointmentsTab";
import TabHeader from "./TabHeader";

// assets
import "assets/styles/PatientDetail/PatientDetail.css";

// services
import { PatientService } from "services/index";
import { AppointmentService } from "services";

function PatientDetail() {
  let { id } = useParams();
  id = Number.isInteger(parseInt(id)) ? parseInt(id) : null;

  // Set the default values
  const [patient, setPatient] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    id && getPatient(id);
  }, [id]);

  useEffect(() => {
    if (patient) {
      getAppointmentsCount();
      // getPaymentsCount();
      // getProceduresCount();
      // getNotes();
    }
  }, [patient, appointmentDialog]);

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

  // Get the list of appointments of the patient and set appointmets value
  const getAppointmentsCount = async () => {
    let response;
    let counts_;

    try {
      response = await AppointmentService.getAppointments(patient.id);

      counts_ = [...counts];
      counts_[0] = response.data.length;
      setCounts(counts_);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // Show add appointment dialog
  const showAppointmentDialog = () => {
    setAppointmentDialog(true);
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setAppointmentDialog(false);
  };

  const handleTabChange = (event) => {
    setActiveIndex(event.index);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Toolbar action template
  const actionTemplate = () => {
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
              actionTemplate={actionTemplate}
            />

            <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Randevular"
                    badge={counts[0]}
                    onClick={options.onClick}
                  />
                )}
              >
                <AppointmentsTab
                  patient={patient}
                  appointmentDialog={appointmentDialog}
                  showDialog={showAppointmentDialog}
                  hideDialog={hideAppointmentDialog}
                />
              </TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Ödemeler"
                    badge={counts[1]}
                    onClick={options.onClick}
                  />
                )}
              ></TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Tedaviler"
                    badge={counts[2]}
                    onClick={options.onClick}
                  />
                )}
              ></TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Notlar"
                    badge={counts[3]}
                    onClick={options.onClick}
                  />
                )}
              ></TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Dökümanlar"
                    badge={counts[4]}
                    onClick={options.onClick}
                  />
                )}
              ></TabPanel>
            </TabView>
          </div>
        </Grid>
      </Grid>
    )
  );
}

export default PatientDetail;
