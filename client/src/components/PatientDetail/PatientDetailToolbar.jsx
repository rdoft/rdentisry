import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Toolbar, Divider } from "primereact";
import { Typography, Stack } from "@mui/material";
import { DropdownPatient } from "components/Dropdown";
import { PatientDialog } from "components/Dialog";
import { useLoading } from "context/LoadingProvider";

// assets
import "assets/styles/PatientDetail/PatientDetailToolbar.css";

// services
import { PatientService } from "services";

function PatientDetailToolbar({ patient, patients, setPatients, endContent }) {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  // Set the default values
  const [patientDialog, setPatientDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("patients");
    PatientService.getPatients(null, { signal })
      .then((res) => {
        setPatients(res.data);
      })
      .catch((error) => {})
      .finally(() => stopLoading("patients"));

    return () => {
      controller.abort();
    };
  }, [setPatients, startLoading, stopLoading]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
  const getPatients = async () => {
    let response;
    let patients;

    try {
      // GET /patients
      response = await PatientService.getPatients();
      patients = response.data;
      // Set new doctors
      setPatients(patients);
    } catch (error) {
      // Set error status and show error toast message
    }
  };

  // Save patient (create)
  const savePatient = async (patient) => {
    let response;

    try {
      startLoading("save");
      // Create a new patient
      response = await PatientService.savePatient(patient);
      patient = response.data;

      // Set the patients and close the dialog
      await getPatients();
      setPatientDialog(false);
      navigate(`/patients/${patient.id}`);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  // Show add patient dialog
  const showPatientDialog = () => {
    setPatientDialog(true);
  };

  // Hide add patient dialog
  const hidePatientDialog = () => {
    setPatientDialog(false);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Get title
  const getTitle = () => {
    return (
      <Stack>
        <Typography variant="h3">Hasta</Typography>
        <Typography variant="caption" style={{ color: "gray" }}>
          Hastalar{" "}
          <i className="pi pi-angle-right" style={{ fontSize: "0.7rem" }} />{" "}
          Hasta Detayı
        </Typography>
      </Stack>
    );
  };

  // Toolbar content thats are on left
  const centerContent = (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DropdownPatient
        key={patient?.id}
        value={patient}
        options={patients}
        onChange={handleChange}
        onClickAdd={showPatientDialog}
        style={{ alignItems: "center", height: "3rem" }}
      />
    </div>
  );

  return (
    <>
      <Toolbar
        className="p-1"
        start={getTitle}
        center={centerContent}
        end={endContent}
        style={{ border: "none" }}
      />
      <Divider className="m-1 p-1" />
      {patientDialog && (
        <PatientDialog onHide={hidePatientDialog} onSubmit={savePatient} />
      )}
    </>
  );
}

export default PatientDetailToolbar;
