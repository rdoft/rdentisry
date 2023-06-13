import React, { useState, useEffect } from "react";

import {
  Dialog,
  Dropdown,
  InputText,
  InputTextarea,
  Divider,
  Calendar,
} from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";
import DropdownItem from "components/DropdownItem/DropdownItem";
import { toast } from "react-hot-toast";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";

import schema from "schemas/appointment.schema";

// services
import { PatientService, DoctorService } from "services";
import { toastErrorMessage } from "components/errorMesage";

function AppointmentDialog({ _appointment = {}, onHide, onSubmit }) {
  // Set default empty Appointment
  let emptyAppointment = {
    patient: null,
    doctor: null,
    description: "",
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    duration: "",
  };

  // Dropdown selected Item
  const [doctors, setDoctors] = useState(null);
  const [patients, setPatients] = useState(null);
  const [appointment, setAppointment] = useState({
    ...emptyAppointment,
    ..._appointment,
  });
  // Validation of appointment object
  const [isValid, setIsValid] = useState(false);
  // Validation(error) of appointment properties
  const [isError, setIsError] = useState({
    patient: false,
    doctor: false,
    description: false,
    date: false,
    startTime: false,
    endTime: false,
    duration: false,
  });

  // Set the doctors from dropdown on loading
  useEffect(() => {
    getDoctors();
    getPatients();
  }, []);

  useEffect(() => {
    const _isValid = !schema.appointment.validate(appointment).error;

    setIsValid(_isValid);
  }, [appointment]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of doctors and set doctors value
  const getDoctors = async () => {
    let response;
    let doctors;

    try {
      // GET /doctors
      response = await DoctorService.getDoctors();
      doctors = response.data;
      // Set new doctors
      setDoctors(doctors);
    } catch (error) {
      // Set error status and show error toast message
      toast.error(toastErrorMessage(error));
    }
  };

  // Get the list of doctors and set doctors value
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
  console.log(patients)

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    let value = event.target && event.target.value;

    let _appointment = { ...appointment };
    let _isError = { ...isError };

    if (attr === "duration") {
      let newEndTime = new Date(_appointment.startTime);
      newEndTime.setMinutes(newEndTime.getMinutes() + parseInt(value));
      _appointment.endTime = newEndTime;
      _appointment[attr] = value;
    } else if (attr === "startTime" && value && value > _appointment.endTime) {
      _appointment.endTime = value;
    } else if (attr === "endTime" && value && value < _appointment.startTime) {
      _appointment.startTime = value;
    } else {
      _appointment[attr] = value;
    }
    // _isError[attr] = schema[attr].validate(value).error
    //   ? true
    //   : false;
    console.log(appointment)
    setIsError(_isError);
    setAppointment(_appointment);
  };

  //old appointment for update
  useEffect(() => {
    let _appointment = { ...appointment };
    if (_appointment.endTime) {
      _appointment.endTime = new Date(_appointment.endTime);
    }
    if (_appointment.startTime) {
      _appointment.startTime = new Date(_appointment.startTime);
    }
    if (_appointment.date) {
      _appointment.date = new Date(_appointment.date);
    }
    if (_appointment.endTime && _appointment.startTime) {
      const a = new Date(_appointment.endTime);
      const b = new Date(_appointment.startTime);
      const hoursDiff = a.getHours() - b.getHours();
      const minutesDiff = a.getMinutes() - b.getMinutes();
      _appointment.duration = hoursDiff * 60 + minutesDiff;
    }

    setAppointment(_appointment);
  }, [isError]);

  // onHide handler
  const handleHide = () => {
    setIsError({
      doctorId: false,
      description: false,
      date: false,
      startTime: false,
      endTime: false,
      duration: false,
    });
    onHide();
  };

  // onSubmit handler
  const handleSubmit = async () => {
    await onSubmit(appointment);
  };

  // onSubmit handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
    }
  };

  // TEMPLATES
  // Dropdwon item template
  const patientDropdownItemTemplate = (option, props) => {
    return (
      <DropdownItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarPatient}
      />
    );
  };

  // Dropdwon item template
  const doctorDropdownItemTemplate = (option, props) => {
    return (
      <DropdownItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarDoctor}
      />
    );
  };

  return (
    <Dialog
      visible
      style={{ width: "450px" }}
      header="Randevu Planla"
      modal
      className="p-fluid"
      footer={
        <DialogFooter
          disabled={!isValid}
          onHide={handleHide}
          onSubmit={handleSubmit}
        />
      }
      onHide={handleHide}
      onKeyDown={handleKeyDown}
    >
      {/* Divider */}
      <Divider type="solid" className="mt-0" />

      {/* Dropdown Patients */}
      <div className="field mb-3">
        <Dropdown
          value={appointment.patient}
          options={patients}
          optionLabel="name"
          filter
          filterBy="name,surname,idNumber"
          placeholder="Hasta seçiniz..."
          valueTemplate={patientDropdownItemTemplate}
          itemTemplate={patientDropdownItemTemplate}
          onChange={(event) => handleChange(event, "patient")}
        />
      </div>

      {/* Dropdown Doctors */}
      <div className="field mb-3">
        <Dropdown
          value={appointment.doctor}
          options={doctors}
          optionLabel="name"
          filter
          filterBy="name,surname"
          placeholder="Doktor seçiniz..."
          valueTemplate={doctorDropdownItemTemplate}
          itemTemplate={doctorDropdownItemTemplate}
          onChange={(event) => handleChange(event, "doctor")}
        />
      </div>

      {/* Description */}
      <div className="field mb-3">
        <InputTextarea
          value={appointment.description}
          placeholder="Açıklama"
          onChange={(event) => handleChange(event, "description")}
          rows={5}
          cols={30}
        />
      </div>

      {/* Date */}
      <div className="flex grid align-items-center mb-3">
        <label htmlFor="date" className="col-12 md:col-2 font-bold text-right">
          Tarih <small className="p-error">*</small>
        </label>

        <Calendar
          id="date"
          className="col-6 md:col-4"
          value={appointment.date}
          onChange={(event) => handleChange(event, "date")}
          dateFormat="dd/M/yy"
          minDate={new Date()}
        />
      </div>

      {/* Time */}
      <div className="flex grid align-items-center mb-3">
        <label className="col-12 md:col-2 font-bold text-right">
          Saat <small className="p-error">*</small>
        </label>

        {/* Start */}
        <Calendar
          className="col-6 md:col-4"
          value={appointment.startTime}
          onChange={(event) => handleChange(event, "startTime")}
          timeOnly
        />

        <label className="col-12 md:col-1 font-bold text-center">-</label>
        {/* End */}
        <Calendar
          className="col-6 md:col-4"
          value={appointment.endTime}
          onChange={(event) => handleChange(event, "endTime")}
          timeOnly
        />
      </div>

      {/* Duration */}
      <div className="flex grid align-items-center mb-3">
        <label
          htmlFor="duration"
          className="col-12 md:col-2 font-bold text-right"
        >
          Süre <small className="p-error">*</small>
        </label>

        <div className="col-6 md:col-4">
          <InputText
            id="duration"
            className="w-full"
            placeholder={"dk"}
            value={appointment.duration}
            onChange={(event) => handleChange(event, "duration")}
          />
          {isError["duration"] && <small className="p-error">Geçersiz</small>}
        </div>
      </div>
    </Dialog>
  );
}

export default AppointmentDialog;
