import React from "react";
import { Typography } from "@mui/material";
import { Toolbar, Dropdown, Button, InputSwitch, Divider } from "primereact";
import DropdownPersonItem from "components/DropdownItem/DropdownPersonItem";
import ActionGroup from "components/ActionGroup/ActionGroup";

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

  // TODO:
  // onClick handler for add doctor button
  const handleClickAdd = () => {
    console.log("Add doctor");
  };

  // TEMPLATES -----------------------------------------------------------------
  // Dropdown item template
  const doctorDropdownItemTemplate = (option, props) => {
    return (
      <DropdownPersonItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarDoctor}
        isDoctor={true}
      />
    );
  };

  // Dropdown panel footer
  const doctorDropdownFooter = () => {
    return (
      <div className="m-2">
        <Divider className="mt-0 mb-2" />
        <ActionGroup label="Doktor Ekle" onClickAdd={handleClickAdd} />
      </div>
    );
  };

  // Get doctor dropdown
  const centerContent = () => (
    <React.Fragment>
      <Dropdown
        value={doctor}
        options={doctors}
        optionLabel="name"
        valueTemplate={doctorDropdownItemTemplate}
        itemTemplate={doctorDropdownItemTemplate}
        panelFooterTemplate={doctorDropdownFooter}
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
