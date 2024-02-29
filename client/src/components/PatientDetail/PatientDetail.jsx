import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler, getTabCounts } from "utils";
import { TabView, TabPanel } from "primereact";
import { Grid } from "@mui/material";
import NotesTab from "./Notes/NotesTab";
import PaymentsTab from "./Payments/PaymentsTab";
import ProceduresTab from "./Procedures/ProceduresTab";
import AppointmentsTab from "./Appointments/AppointmentsTab";
import TabHeader from "./TabHeader";
import PatientDetailToolbar from "./PatientDetailToolbar";
import PatientDetailToolbarAction from "./PatientDetailToolbarAction";

// assets
import "assets/styles/PatientDetail/PatientDetail.css";

// services
import { PatientService } from "services";

function PatientDetail() {
  const navigate = useNavigate();
  // Get patient id
  const { id } = useParams();

  // Set the default values
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState(null);
  const [activeIndex, setActiveIndex] = useState(
    localStorage.getItem("activeTabIndex")
      ? parseInt(localStorage.getItem("activeTabIndex"))
      : 0
  );
  const [counts, setCounts] = useState({
    appointment: 0,
    payment: 0,
    note: 0,
    procedure: 0,
  });
  const [dialog, setDialog] = useState({
    appointment: false,
    payment: false,
    note: false,
    procedure: false,
  });

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const patientId = Number.isInteger(parseInt(id)) ? parseInt(id) : null;
    PatientService.getPatient(patientId, { signal })
      .then(async (res) => {
        const _counts = await getTabCounts(res.data);
        setCounts(_counts);
        setPatient(res.data);
      })
      .catch((error) => {
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate, id]);

  useEffect(() => {
    localStorage.getItem("activeTabIndex")
      ? setActiveIndex(parseInt(localStorage.getItem("activeTabIndex")))
      : setActiveIndex(0);
  }, [id]);

  // HANDLERS -----------------------------------------------------------------
  // Show add appointment dialog
  const showAppointmentDialog = () => {
    setDialog({
      ...dialog,
      appointment: true,
    });
  };

  // Hide add appointment dialog
  const hideAppointmentDialog = () => {
    setDialog({
      ...dialog,
      appointment: false,
    });
  };

  // Show add appointment dialog
  const showPaymentDialog = () => {
    setDialog({
      ...dialog,
      payment: true,
    });
  };

  // Hide add appointment dialog
  const hidePaymentDialog = () => {
    setDialog({
      ...dialog,
      payment: false,
    });
  };

  // Show add note dialog
  const showNoteDialog = () => {
    setDialog({
      ...dialog,
      note: true,
    });
  };

  // Hide note dialog
  const hideNoteDialog = () => {
    setDialog({
      ...dialog,
      note: false,
    });
  };

  // Show add procedure dialog
  const showProcedureDialog = () => {
    setDialog({
      ...dialog,
      procedure: true,
    });
  };

  // Hide procedure dialog
  const hideProcedureDialog = () => {
    setDialog({
      ...dialog,
      procedure: false,
    });
  };

  // Handler for tab changes
  const handleTabChange = (event) => {
    setActiveIndex(event.index);
    localStorage.setItem("activeTabIndex", event.index);
  };

  return (
    patient && (
      <Grid container item rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
          {/* Toolbar */}
          <PatientDetailToolbar
            patient={patient}
            patients={patients}
            setPatients={setPatients}
            startContent={
              <PatientDetailToolbarAction
                activeIndex={activeIndex}
                showAppointmentDialog={showAppointmentDialog}
                showPaymentDialog={showPaymentDialog}
                showNoteDialog={showNoteDialog}
                showProcedureDialog={showProcedureDialog}
              />
            }
          />

          {/* Tabs */}
          <TabView
            className="rounded-tabview"
            activeIndex={activeIndex}
            onTabChange={handleTabChange}
          >
            {/* Appointments tab */}
            <TabPanel
              headerTemplate={(options) => (
                <TabHeader
                  label="Randevular"
                  isActive={activeIndex === 0}
                  badge={counts.appointment}
                  onClick={options.onClick}
                />
              )}
            >
              <AppointmentsTab
                patient={patient}
                patients={patients}
                setPatients={setPatients}
                appointmentDialog={dialog.appointment}
                showDialog={showAppointmentDialog}
                hideDialog={hideAppointmentDialog}
                counts={counts}
                setCounts={setCounts}
              />
            </TabPanel>

            {/* Payments tab */}
            <TabPanel
              headerTemplate={(options) => (
                <TabHeader
                  label="Ödemeler"
                  isActive={activeIndex === 1}
                  badge={counts.payment}
                  onClick={options.onClick}
                />
              )}
            >
              <PaymentsTab
                patient={patient}
                paymentDialog={dialog.payment}
                showDialog={showPaymentDialog}
                hideDialog={hidePaymentDialog}
                counts={counts}
                setCounts={setCounts}
              />
            </TabPanel>

            {/* Notes tab */}
            <TabPanel
              headerTemplate={(options) => (
                <TabHeader
                  label="Notlar"
                  isActive={activeIndex === 2}
                  badge={counts.note}
                  onClick={options.onClick}
                />
              )}
            >
              <NotesTab
                patient={patient}
                noteDialog={dialog.note}
                hideDialog={hideNoteDialog}
                counts={counts}
                setCounts={setCounts}
              />
            </TabPanel>

            {/* Procedures tab */}
            <TabPanel
              headerTemplate={(options) => (
                <TabHeader
                  label="Tedaviler"
                  isActive={activeIndex === 3}
                  badge={counts.procedure}
                  onClick={options.onClick}
                />
              )}
            >
              <ProceduresTab
                patient={patient}
                procedureDialog={dialog.procedure}
                hideDialog={hideProcedureDialog}
                counts={counts}
                setCounts={setCounts}
              />
            </TabPanel>

            {/* Docs tab */}
            {/* <TabPanel
                headerTemplate={(options) => (
                  <TabHeader
                    label="Dökümanlar"
                    isActive={activeIndex === 4}
                    badge={counts.document}
                    onClick={options.onClick}
                  />
                )}
              ></TabPanel> */}
          </TabView>
        </Grid>
      </Grid>
    )
  );
}

export default PatientDetail;
