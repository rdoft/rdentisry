import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { Toolbar } from "primereact";
import { DropdownPatient } from "components/Dropdown";
import { PatientDialog } from "components/Dialog";

// assets
import "assets/styles/PatientDetail/PatientDetailToolbar.css";

// services
import { PatientService } from "services";

function PatientDetailToolbar({
  patient,
  patients,
  setPatient,
  setPatients,
  startContent,
}) {
  const navigate = useNavigate();
  // Set the default values
  const [patientDialog, setPatientDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    getPatients();
  }, []);

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
      // Create a new patient
      response = await PatientService.savePatient(patient);
      patient = response.data;

      // Set the patients and close the dialog
      getPatients();
      setPatientDialog(false);
      setPatient(patient);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let value = event.target && event.target.value;
    navigate(`/patients/${value.id}`);
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
  // Toolbar content thats are on left
  const endContent = (
    <DropdownPatient
      value={patient}
      options={patients}
      onChange={handleChange}
      onClickAdd={showPatientDialog}
    />
  );

  return (
    <>
      <Toolbar className="mb-4 p-2" start={startContent} end={endContent} />
      {patientDialog && (
        <PatientDialog onHide={hidePatientDialog} onSubmit={savePatient} />
      )}
    </>
  );
}

export default PatientDetailToolbar;
