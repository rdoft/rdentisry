import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { Typography } from "@mui/material";
import { Toolbar, Button, InputSwitch } from "primereact";
import { DropdownDoctor } from "components/Dropdown";
import { DoctorDialog } from "components/Dialog";

// services
import { DoctorService } from "services";

// assets
import "assets/styles/AppointmentCalendar/CalendarToolbar.css";

function CalendarToolbar({
  showAll,
  doctor,
  doctors,
  setDoctor,
  setDoctors,
  setShowAll,
  onClickAddAppointment,
}) {
  const navigate = useNavigate();

  // Set the default values
  const [doctorDialog, setDoctorDialog] = useState(false);

  // Get doctors on loading
  useEffect(() => {
    getDoctors();
  }, []);

  // SERVICES -----------------------------------------------------------------
  // Get the list of doctors and set doctors value
  const getDoctors = async () => {
    let response;
    let doctors;

    try {
      response = await DoctorService.getDoctors();
      doctors = response.data;
      // Set new doctors
      setDoctors(doctors);
      // !doctor && setDoctor(doctors?.[0]);
    } catch (error) {
      // Set error status and show error toast message
    }
  };

  // Save doctor (create)
  const saveDoctor = async (doctor) => {
    let response;

    try {
      response = await DoctorService.saveDoctor(doctor);
      doctor = response.data;

      // Get and set the updated list of doctors
      getDoctors();
      setDoctorDialog(false);
      setDoctor(doctor);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Delete the doctor
  const deleteDoctor = async (doctor) => {
    let response;

    try {
      response = await DoctorService.deleteDoctor(doctor.id);
      doctor = response.data;

      // Get and set the updated list of doctors
      getDoctors();
      setDoctor(null);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler for showAll switch
  const handleChangeSwitch = (event) => {
    setShowAll(event.value);
  };

  // onChange handler for doctor dropdown
  const handleChangeDropdown = (event) => {
    let value = event.target && event.target.value;
    setDoctor(value);
  };

  // Show add doctor dialog
  const showDoctorDialog = () => {
    setDoctorDialog(true);
  };

  // Hide add doctor dialog
  const hideDoctorDialog = () => {
    setDoctorDialog(false);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Get doctor dropdown
  const centerContent = () => (
    <DropdownDoctor
      value={doctor}
      options={doctors}
      onChange={handleChangeDropdown}
      onClickAdd={showDoctorDialog}
      onClickDelete={deleteDoctor}
      className={!doctor && "p-2"}
      style={{ width: "20vw" }}
    />
  );

  // Get showAll switch
  const endContent = () => (
    <React.Fragment>
      <Typography variant="subtitle2" margin={1}>
        Geçmiş randevu
      </Typography>
      <InputSwitch
        checked={showAll}
        onChange={handleChangeSwitch}
        style={{ margin: 5, transform: "scale(0.8)" }}
      />
    </React.Fragment>
  );

  // Get Add appointment buttons
  const startContent = () => (
    <React.Fragment>
      <Button
        label="Randevu Ekle"
        icon="pi pi-plus"
        size="small"
        className="p-button-info mr-2"
        onClick={onClickAddAppointment}
      />
    </React.Fragment>
  );

  return (
    <>
      <Toolbar
        className="mb-4 p-2"
        start={startContent}
        center={centerContent}
        end={endContent}
      />
      {doctorDialog && (
        <DoctorDialog onHide={hideDoctorDialog} onSubmit={saveDoctor} />
      )}
    </>
  );
}

export default CalendarToolbar;
