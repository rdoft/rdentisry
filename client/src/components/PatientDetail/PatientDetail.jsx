import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { TabView, TabPanel, Button } from "primereact";
import { Grid } from "@mui/material";
import TabHeader from "./TabHeader";
import AppointmentsTab from "./Appointments/AppointmentsTab";
import PaymentsTab from "./Payments/PaymentsTab";
import PatientDetailToolbar from "./PatientDetailToolbar";
import ProceduresTab from "./Procedures/ProceduresTab";

// assets
import "assets/styles/PatientDetail/PatientDetail.css";

// services
import { PatientService } from "services/index";
import { AppointmentService, PaymentService, NoteService } from "services";
import NotesTab from "./Notes/NotesTab";

// Get the active index based on the path
const getActiveIndex = (tab) => {
  switch (tab) {
    case `appointments`:
      return 0;
    case `payments`:
      return 1;
    case `notes`:
      return 2;
    case `procedures`:
      return 3;
    // case `documents`:
    //   return 4;
    default:
      return 0;
  }
};

function PatientDetail() {
  // Get patient id
  let { id } = useParams();
  id = Number.isInteger(parseInt(id)) ? parseInt(id) : null;

  // Get active tab index
  let { search } = useLocation();
  let tab = new URLSearchParams(search).get("tab");
  let idx = getActiveIndex(tab);

  // Set the default values
  const [patient, setPatient] = useState(null);
  const [activeIndex, setActiveIndex] = useState(idx);
  const [countAppointment, setCountAppointment] = useState(0);
  const [countPayment, setCountPayment] = useState(0);
  const [countNote, setCountNote] = useState(0);
  const [countProcedure, setCountProcedure] = useState(0);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [noteDialog, setNoteDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    id && getPatient(id);
  }, [id]);

  useEffect(() => {
    if (patient) {
      getCounts(-1);
    }
  }, [patient]);

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
  const getCounts = async (_activeIndex) => {
    let response;
    _activeIndex = _activeIndex || activeIndex;

    try {
      switch (_activeIndex) {
        case 0:
          // Get the list of appointments of the patient and set appointments count
          response = await AppointmentService.getAppointments(patient.id);
          setCountAppointment(response.data.length || 0);
          break;
        case 1:
          // Get the list of payments of the patient and set payments count
          response = await PaymentService.getPayments(patient.id);
          setCountPayment(response.data.length || 0);
          break;
        case 2:
          // Get the list of notes of the patient and set notes count
          response = await NoteService.getNotes(patient.id);
          setCountNote(response.data.length || 0);
          break;
        // case 3:
        //   return null;
        // case 4:
        //   return null;
        default:
          // Get all counts and set it
          response = await AppointmentService.getAppointments(patient.id);
          setCountAppointment(response.data.length || 0);
          response = await PaymentService.getPayments(patient.id);
          setCountPayment(response.data.length || 0);
          response = await NoteService.getNotes(patient.id);
          setCountNote(response.data.length || 0);
          break;
      }
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

  // Show add note dialog
  const showNoteDialog = () => {
    setNoteDialog(true);
  };

  // Hide note dialog
  const hideNoteDialog = () => {
    setNoteDialog(false);
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
      case 2:
        return (
          <Button
            label="Not Ekle"
            icon="pi pi-plus"
            className="p-button-text p-button-info"
            onClick={showNoteDialog}
          />
        );
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

            <TabView
              className="rounded-tabview"
              activeIndex={activeIndex}
              onTabChange={handleTabChange}
            >
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Randevular"
                    badge={countAppointment}
                    onClick={options.onClick}
                  />
                )}
              >
                <AppointmentsTab
                  patient={patient}
                  appointmentDialog={appointmentDialog}
                  showDialog={showAppointmentDialog}
                  hideDialog={hideAppointmentDialog}
                  getCounts={getCounts}
                />
              </TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Ödemeler"
                    badge={countPayment}
                    onClick={options.onClick}
                  />
                )}
              >
                <PaymentsTab
                  patient={patient}
                  paymentDialog={paymentDialog}
                  showDialog={showPaymentDialog}
                  hideDialog={hidePaymentDialog}
                  getCounts={getCounts}
                />
              </TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Notlar"
                    badge={countNote}
                    onClick={options.onClick}
                  />
                )}
              >
                <NotesTab
                  patient={patient}
                  noteDialog={noteDialog}
                  hideDialog={hideNoteDialog}
                  getCounts={getCounts}
                />
              </TabPanel>
              <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Tedaviler"
                    badge={countProcedure}
                    onClick={options.onClick}
                  />
                )}
              >
                <ProceduresTab patient={patient} />
              </TabPanel>
              {/* <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Dökümanlar"
                    badge={countDocument}
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
