import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toolbar } from "primereact";
import DropdownPatient from "components/Dropdown/DropdownPatient";

// assets
import "assets/styles/PatientDetail/PatientDetailToolbar.css";

// services
import { PatientService } from "services";

function PatientDetailToolbar({ patient, actionTemplate }) {
  const navigate = useNavigate();
  // Set the default values
  const [patients, setPatients] = useState(null);

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

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let value = event.target && event.target.value;
    navigate(`/patients/${value.id}`);
  };

  // TEMPLATES ----------------------------------------------------------------
  // Toolbar content thats are on left
  const centerContent = (
    <DropdownPatient
      value={patient}
      options={patients}
      onChange={handleChange}
    />
  );

  // Toolbar content thats are on left
  const startContent = (
    <React.Fragment>
      {/* Get action button */}
      {actionTemplate()}
    </React.Fragment>
  );

  return (
    <Toolbar className="mb-4 p-2" start={startContent} center={centerContent} />
  );
}

export default PatientDetailToolbar;
