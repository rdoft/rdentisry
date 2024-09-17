import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Typography } from "@mui/material";
import { Toolbar, Divider, InputSwitch } from "primereact";
import { DropdownDoctor } from "components/Dropdown";
import { DoctorDialog } from "components/Dialog";
import { useLoading } from "context/LoadingProvider";

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
}) {
  const { startLoading, stopLoading } = useLoading();

  // Set the default values
  const [doctorDialog, setDoctorDialog] = useState(false);

  // Get doctors on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("doctors");
    DoctorService.getDoctors({ signal })
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((error) => {})
      .finally(() => stopLoading("doctors"));

    return () => {
      controller.abort();
    };
  }, [setDoctors, startLoading, stopLoading]);

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
      startLoading("save");
      response = await DoctorService.saveDoctor(doctor);
      doctor = response.data;

      // Get and set the updated list of doctors
      await getDoctors();
      setDoctorDialog(false);
      setDoctor(doctor);
      localStorage.setItem("doctor", JSON.stringify(doctor));
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // Delete the doctor
  const deleteDoctor = async (doctor) => {
    let response;

    try {
      startLoading("delete");
      response = await DoctorService.deleteDoctor(doctor.id);
      doctor = response.data;

      // Get and set the updated list of doctors
      await getDoctors();
      setDoctor(null);
      localStorage.removeItem("doctor");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
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
  // Get title
  const getTitle = () => {
    return (
      <Typography variant="h3" style={{ paddingRight: "50px" }}>
        Takvim
      </Typography>
    );
  };

  // Get doctor dropdown
  const centerContent = () => (
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
      <DropdownDoctor
        key={doctor?.id}
        value={doctor}
        options={doctors}
        onChange={handleChangeDropdown}
        onClickAdd={showDoctorDialog}
        onClickDelete={deleteDoctor}
        style={{ alignItems: "center", height: "2.5rem" }}
      />
    </div>
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
        style={{
          margin: 5,
          transform: "scale(0.8)",
        }}
      />
    </>
  );

  return (
    <>
      <Toolbar
        className="p-2"
        start={getTitle}
        center={centerContent}
        end={endContent}
        style={{ border: "none" }}
      />
      <Divider className="m-1 p-1" />
      {doctorDialog && (
        <DoctorDialog onHide={hideDoctorDialog} onSubmit={saveDoctor} />
      )}
    </>
  );
}

export default CalendarToolbar;
