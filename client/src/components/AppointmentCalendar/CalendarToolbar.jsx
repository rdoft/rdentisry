import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Typography } from "@mui/material";
import { Toolbar, InputSwitch } from "primereact";
import { DropdownDoctor } from "components/Dropdown";
import { DoctorDialog } from "components/Dialog";
import { Add } from "components/Button";

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
  // Set the default values
  const [doctorDialog, setDoctorDialog] = useState(false);

  // Get doctors on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    DoctorService.getDoctors({ signal })
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((error) => {});

    return () => {
      controller.abort();
    };
  }, [setDoctors]);

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
      localStorage.setItem("doctor", JSON.stringify(doctor));
    } catch (error) {
      toast.error(error.message);
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
      localStorage.removeItem("doctor");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler for showAll switch
  const handleChangeSwitch = (event) => {
    localStorage.setItem("showAllAppointment", event.value);
    setShowAll(event.value);
  };

  // onChange handler for doctor dropdown
  const handleChangeDropdown = (event) => {
    let value = event.target && event.target.value;
    setDoctor(value);
    value
      ? localStorage.setItem("doctor", JSON.stringify(value))
      : localStorage.removeItem("doctor");
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
      style={{ width: "22vw" }}
    />
  );

  // Get showAll switch
  const endContent = () => (
    <>
      <Typography variant="subtitle2" margin={1}>
        Geçmiş randevu
      </Typography>
      <InputSwitch
        checked={showAll}
        onChange={handleChangeSwitch}
        style={{ margin: 5, transform: "scale(0.8)" }}
      />
    </>
  );

  // Get Add appointment buttons
  const startContent = () => (
    <Add
      label={"Randevu Ekle"}
      default={true}
      onClick={onClickAddAppointment}
    />
  );

  return (
    <>
      <Toolbar
        className="mb-3 p-2"
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
