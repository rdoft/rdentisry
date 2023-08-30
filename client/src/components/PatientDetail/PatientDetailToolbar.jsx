import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Toolbar } from "primereact";
import DropdownItem from "components/DropdownItem/DropdownItem";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";
import "assets/styles/PatientDetail/PatientDetailToolbar.css";

// services
import { PatientService } from "services/index";

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
  // Dropdwon item template
  const patientDropdownTemplate = (option, props) => {
    return (
      <DropdownItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarPatient}
      />
    );
  };

  // Toolbar content thats are on left
  const rightContent = (
    <React.Fragment>
      {/* Get patient information */}
      <Dropdown
        value={patient}
        options={patients}
        optionLabel="name"
        filter
        filterBy="name,surname,phone"
        placeholder="Hasta seçiniz..."
        valueTemplate={patientDropdownTemplate}
        itemTemplate={patientDropdownTemplate}
        onChange={(event) => handleChange(event)}
        className="w-full"
      />
    </React.Fragment>
  );

  // Toolbar content thats are on left
  const leftContent = (
    <React.Fragment>
      {/* Get action button */}
      {actionTemplate()}
    </React.Fragment>
  );
  return (
    <Toolbar className="mb-4 p-2" left={leftContent} right={rightContent} />
  );
}

export default PatientDetailToolbar;
