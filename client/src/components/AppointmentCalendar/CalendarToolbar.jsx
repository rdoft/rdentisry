import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { Typography } from "@mui/material";
import { Toolbar, Dropdown, Button, InputSwitch, Divider } from "primereact";
import DropdownPersonItem from "components/DropdownItem/DropdownPersonItem";
import ActionGroup from "components/ActionGroup/ActionGroup";
import DoctorDialog from "components/Dialog/DoctorDialog";

// services
import { DoctorService } from "services";

// assets
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";
import "assets/styles/AppointmentCalendar/CalendarToolbar.css";

function CalendarToolbar({
  doctor,
  showAll,
  setDoctor,
  setShowAll,
  onClickAddAppointment,
}) {
  const navigate = useNavigate();

  // Set the default values
  const [doctorDialog, setDoctorDialog] = useState(false);
  const [doctors, setDoctors] = useState(null);

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
        <ActionGroup label="Doktor Ekle" onClickAdd={showDoctorDialog} />
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
        className="p-button-text p-button-info mr-2"
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
