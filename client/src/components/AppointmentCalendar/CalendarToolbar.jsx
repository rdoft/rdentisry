import React, { useEffect, useState } from "react";
import { Toolbar, Dropdown, Button, InputSwitch } from "primereact";
import { Typography } from "@mui/material";
import DropdownItem from "components/DropdownItem/DropdownPersonItem";

// assets
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";
import "assets/styles/AppointmentCalendar/CalendarToolbar.css";

function CalendarToolbar({
  doctor,
  doctors,
  showAll,
  setDoctor,
  setShowAll,
  onClickAdd,
}) {
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
        valueTemplate={doctorDropdownTemplate}
        itemTemplate={doctorDropdownTemplate}
        onChange={handleChangeDropdown}
        className={doctor ? "w-full" : "w-full p-2"}
        filter
        filterBy="name,surname"
        placeholder="Doktor seçiniz..."
        emptyMessage="Sonuç bulunamadı"
        emptyFilterMessage="Sonuç bulunamadı"
        showClear
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
