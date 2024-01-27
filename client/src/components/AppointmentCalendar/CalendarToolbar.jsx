import React, { useEffect, useState } from "react";
import { Toolbar, Dropdown, Button, InputSwitch } from "primereact";
import { Typography } from "@mui/material";
import DropdownItem from "components/DropdownItem/DropdownPersonItem";

// assets
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";
import "assets/styles/AppointmentCalendar/CalendarToolbar.css";

// services
import { DoctorService } from "services";

function CalendarToolbar({
  doctor,
  showAll,
  setDoctor,
  setShowAll,
  onClickAdd,
}) {
  // Set the default values
  const [doctors, setDoctors] = useState(null);

  // Set the page on loading
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
    } catch (error) {
      // Set error status and show error toast message
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

  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const doctorDropdownTemplate = (option, props) => {
    return (
      <DropdownItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarDoctor}
        isDoctor={true}
      />
    );
  };

  // Get doctor dropdown
  const centerContent = () => (
    <React.Fragment>
      <Dropdown
        value={doctor}
        options={doctors}
        optionLabel="name"
        filter
        filterBy="name,surname"
        placeholder="Doktor seçiniz..."
        valueTemplate={doctorDropdownTemplate}
        itemTemplate={doctorDropdownTemplate}
        onChange={handleChangeDropdown}
        className="w-full"
      />
    </React.Fragment>
  );

  // Get showAll switch
  const endContent = () => (
    <React.Fragment>
      <Typography variant="subtitle2">Tümünü göster</Typography>
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
        className="p-button-text p-button-info mr-2"
        onClick={onClickAdd}
      />
    </React.Fragment>
  );

  return (
    <Toolbar
      className="mb-4 p-2"
      start={startContent}
      center={centerContent}
      end={endContent}
    />
  );
}

export default CalendarToolbar;
