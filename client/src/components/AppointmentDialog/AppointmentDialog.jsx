import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import {
  Dialog,
  Dropdown,
  InputText,
  InputTextarea,
  Divider,
  Calendar,
  ConfirmDialog,
  confirmDialog,
} from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";
import DropdownPersonItem from "components/DropdownItem/DropdownPersonItem";
import ActionGroup from "components/ActionGroup/ActionGroup";
import DoctorDialog from "components/Dialog/DoctorDialog";
import PatientDialog from "components/PatientTable/PatientDialog";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";
import avatarDoctor from "assets/images/avatars/doctor-avatar.png";

// schemas
import schema from "schemas/appointment.schema";

// services
import { PatientService, DoctorService } from "services";

function AppointmentDialog({ _appointment = {}, onHide, onSubmit, onDelete }) {
  const navigate = useNavigate();

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

  // Set the default values
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
  // Dialog display states
  const [doctorDialog, setDoctorDialog] = useState(false);
  const [patientDialog, setPatientDialog] = useState(false);

  // Set the doctors from dropdown on loading
  useEffect(() => {
    getDoctors();
    getPatients();
  }, []);

  useEffect(() => {
    const _isValid = !schema.appointment.validate(appointment).error;

    setIsValid(_isValid);
  }, [appointment]);

  // Old appointment for update
  const calcDuration = (start, end) => {
    if ((start, end)) {
      const hoursDiff = end.getHours() - start.getHours();
      const minutesDiff = end.getMinutes() - start.getMinutes();
      return hoursDiff * 60 + minutesDiff;
    } else {
      return 0;
    }
  };

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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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

  // Save doctor (create)
  const saveDoctor = async (doctor) => {
    let response;

    try {
      response = await DoctorService.saveDoctor(doctor);
      doctor = response.data;

      // Get and set the updated list of doctors
      getDoctors();
      setDoctorDialog(false);
      setAppointment({ ...appointment, doctor });
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Save patient (create)
  const savePatient = async (patient) => {
    let response;

    try {
      response = await PatientService.savePatient(patient);
      patient = response.data;

      // Get and setthe updated list of patients
      getPatients();
      setPatientDialog(false);
      setAppointment({ ...appointment, patient });
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    let value = event.target && event.target.value;

    let _isError = { ...isError };
    let _appointment = { ...appointment };

    if (attr === "startTime") {
      let start = new Date(0);
      let end = new Date(0);

      start.setHours(event.hour());
      start.setMinutes(event.minute());
      value = start;

      _appointment.endTime = new Date(_appointment.endTime);
      end.setHours(_appointment.endTime.getHours());
      end.setMinutes(_appointment.endTime.getMinutes());

      if (start > end) {
        end = start;
        _appointment.endTime = start;
      }
      _appointment.duration = calcDuration(start, end);
    } else if (attr === "duration") {
      value = value ?? 0;
      _appointment.endTime = new Date(_appointment.startTime);
      _appointment.endTime.setMinutes(
        _appointment.endTime.getMinutes() + parseInt(value)
      );
    } else if (attr === "date") {
      value = new Date(
        Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
      );
      _isError[attr] = schema[attr].validate(value).error ? true : false;
    }

    _appointment[attr] = value;
    setIsError(_isError);
    setAppointment(_appointment);
  };

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
    onSubmit(appointment);
  };

  // onDelete handler
  const handleDelete = async () => {
    onDelete(appointment);
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (
      isValid &&
      event.key === "Enter" &&
      event.target.tagName !== "TEXTAREA"
    ) {
      handleSubmit();
    }
  };

  const handleDeleteConfim =
    onDelete &&
    (() => {
      confirmDialog({
        message: "Randevuyu silmek istediğinizden emin misiniz?",
        header: "Randevuyu Sil",
        footer: <DialogFooter onHide={handleHide} onDelete={handleDelete} />,
      });
    });

  // Show doctor dialog
  const showDoctorDialog = () => {
    setDoctorDialog(true);
  };

  // Hide doctor dialog
  const hideDoctorDialog = () => {
    setDoctorDialog(false);
  };

  // Show patient dialog
  const showPatientDialog = () => {
    setPatientDialog(true);
  };

  // Hide patient dialog
  const hidePatientDialog = () => {
    setPatientDialog(false);
  };

  // TEMPLATES
  // Dropdwon item template
  const patientDropdownItemTemplate = (option, props) => {
    return (
      <DropdownPersonItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarPatient}
      />
    );
  };

  // Dropdwon item template
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

  // Dropdown panel footer for doctor
  const doctorDropdownFooter = () => {
    return (
      <div className="m-2">
        <Divider className="mt-0 mb-2" />
        <ActionGroup label="Doktor Ekle" onClickAdd={showDoctorDialog} />
      </div>
    );
  };

  // Dropdown panel footer for patient
  const patientDropdownFooter = () => {
    return (
      <div className="m-2">
        <Divider className="mt-0 mb-2" />
        <ActionGroup label="Hasta Ekle" onClickAdd={showPatientDialog} />
      </div>
    );
  };

  return (
    <>
      <ConfirmDialog />
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
            onDelete={handleDeleteConfim}
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
            valueTemplate={patientDropdownItemTemplate}
            itemTemplate={patientDropdownItemTemplate}
            panelFooterTemplate={patientDropdownFooter}
            onChange={(event) => handleChange(event, "patient")}
            filter
            filterBy="name,surname,phone"
            placeholder="Hasta seçiniz..."
            emptyMessage="Sonuç bulunamadı"
            emptyFilterMessage="Sonuç bulunamadı"
          />
        </div>

        {/* Dropdown Doctors */}
        <div className="field mb-3">
          <Dropdown
            value={appointment.doctor}
            options={doctors}
            optionLabel="name"
            valueTemplate={doctorDropdownItemTemplate}
            itemTemplate={doctorDropdownItemTemplate}
            panelFooterTemplate={doctorDropdownFooter}
            onChange={(event) => handleChange(event, "doctor")}
            filter
            filterBy="name,surname"
            placeholder="Doktor seçiniz..."
            emptyMessage="Sonuç bulunamadı"
            emptyFilterMessage="Sonuç bulunamadı"
            showClear
          />
        </div>

        {/* Description */}
        <div className="field mb-3">
          <InputTextarea
            value={appointment.description ? appointment.description : ""}
            placeholder="Açıklama"
            onChange={(event) => handleChange(event, "description")}
            rows={5}
            cols={30}
          />
        </div>

        {/* Date */}
        <div className="flex grid align-items-center mb-3">
          <label
            htmlFor="date"
            className="col-12 md:col-2 font-bold text-right"
          >
            Tarih <small className="p-error">*</small>
          </label>

          <Calendar
            id="date"
            className="col-6 md:col-4"
            value={new Date(appointment.date)}
            onChange={(event) => handleChange(event, "date")}
            dateFormat="dd/mm/yy"
            minDate={new Date(new Date().setUTCHours(0, 0, 0, 0))}
          />
          {isError["date"] && <small className="p-error">Geçersiz</small>}
        </div>

        {/* Time */}
        <div className="flex grid align-items-center mb-3">
          <label className="col-12 md:col-2 font-bold text-right">
            Saat <small className="p-error">*</small>
          </label>

          {/* Start */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              className="col-6 md:col-4"
              value={dayjs(appointment.startTime)}
              onChange={(event) => handleChange(event, "startTime")}
              ampm={false}
            />

            <label className="col-12 md:col-1 font-bold text-center">-</label>
            {/* End */}

            <MobileTimePicker
              className="col-6 md:col-4"
              disabled={true}
              value={dayjs(appointment.endTime)}
              onChange={(event) => handleChange(event, "endTime")}
              ampm={false}
            />
          </LocalizationProvider>
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
          </div>
        </div>
      </Dialog>
      {doctorDialog && (
        <DoctorDialog onHide={hideDoctorDialog} onSubmit={saveDoctor} />
      )}
      {patientDialog && (
        <PatientDialog onHide={hidePatientDialog} onSubmit={savePatient} />
      )}
    </>
  );
}

export default AppointmentDialog;
