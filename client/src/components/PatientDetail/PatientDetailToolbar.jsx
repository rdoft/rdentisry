import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Toolbar } from "primereact";
import DropdownItem from "components/DropdownItem/DropdownPersonItem";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";
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
  const centerContent = (
    <React.Fragment>
      {/* Get patient information */}
      <Dropdown
        value={patient}
        options={patients}
        optionLabel="name"
        valueTemplate={patientDropdownTemplate}
        itemTemplate={patientDropdownTemplate}
        onChange={handleChange}
        className="w-full"
        filter
        filterBy="name,surname,phone"
        placeholder="Hasta seçiniz..."
        emptyMessage="Sonuç bulunamadı"
        emptyFilterMessage="Sonuç bulunamadı"
      />
    </React.Fragment>
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
