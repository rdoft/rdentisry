import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { TabView, TabPanel, Button } from "primereact";
import { Grid } from "@mui/material";
import TabHeader from "./TabHeader";
import AppointmentsTab from "./Appointments/AppointmentsTab";
import PaymentsTab from "./Payments/PaymentsTab";
import PatientDetailToolbar from "./PatientDetailToolbar";

// assets
import "assets/styles/PatientDetail/PatientDetail.css";

// services
import { PatientService } from "services/index";
import { AppointmentService, PaymentService } from "services";

function PatientDetail() {
  let { id } = useParams();
  id = Number.isInteger(parseInt(id)) ? parseInt(id) : null;

  // Set the default values
  const [patient, setPatient] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState([]);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    id && getPatient(id);
  }, [id]);

  useEffect(() => {
    if (patient) {
      getCounts();
    }
  }, [patient, appointmentDialog, paymentDialog]);

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

  // Get and set the item counts of the tab
  const getCounts = async () => {
    let response;
    let counts_ = [];

    try {      
      // Get the list of appointments of the patient and set appointments count 
      response = await AppointmentService.getAppointments(patient.id);
      counts_.push(response.data.length || 0);
      // Get the list of payments of the patient and set payments count 
      response = await PaymentService.getPayments(patient.id);
      counts_.push(response.data.length || 0);

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

  // Show add appointment dialog
  const showPaymentDialog = () => {
    setPaymentDialog(true);
  };

  // Hide add appointment dialog
  const hidePaymentDialog = () => {
    setPaymentDialog(false);
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
        return (
          <Button
            label="Ödeme Ekle"
            icon="pi pi-plus"
            className="p-button-text p-button-info"
            onClick={showPaymentDialog}
          />
        );
      // case 2:
      //   return null;
      // case 3:
      //   return null;
      // case 4:
      //   return null;
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
              >
                <PaymentsTab
                  patient={patient}
                  paymentDialog={paymentDialog}
                  showDialog={showPaymentDialog}
                  hideDialog={hidePaymentDialog}
                />
              </TabPanel>
              {/* <TabPanel
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
              ></TabPanel> */}
            </TabView>
          </div>
        </Grid>
      </Grid>
    )
  );
}

export default PatientDetail;
