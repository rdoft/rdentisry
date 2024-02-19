import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import {
  InputText,
  InputTextarea,
  Divider,
  ConfirmDialog,
  confirmDialog,
} from "primereact";

import { DatePicker, TimeRangePicker } from "components/DateTime";
import { DropdownDoctor, DropdownPatient } from "components/Dropdown";
import { DialogTemp, DoctorDialog, PatientDialog } from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { calcDuration } from "utils";

// schemas
import schema from "schemas/appointment.schema";

// services
import { PatientService, DoctorService } from "services";

function AppointmentDialog({
  initAppointment = {},
  doctors,
  patients,
  setDoctors,
  setPatients,
  onHide,
  onSubmit,
  onDelete,
}) {
  const navigate = useNavigate();

  // Set the default values
  const [doctorDialog, setDoctorDialog] = useState(false);
  const [patientDialog, setPatientDialog] = useState(false);
  const [appointment, setAppointment] = useState({
    patient: null,
    doctor: null,
    description: "",
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    duration: "",
    ...initAppointment,
  });
  const [isValid, setIsValid] = useState(false);

  // Set the doctors from dropdown on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    PatientService.getPatients(null, { signal })
      .then((res) => {
        setPatients(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    DoctorService.getDoctors({ signal })
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") return;
        const { code, message } = errorHandler(error);
        code === 401 ? navigate(`/login`) : toast.error(message);
      });

    return () => {
      controller.abort();
    };
  }, [navigate, setDoctors, setPatients]);

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
  const handleChange = (event) => {
    let { name, value } = event.target;
    const _appointment = { ...appointment };

    switch (name) {
      case "startTime":
        let start = new Date(0);
        let end = new Date(0);

        start.setHours(value.hour());
        start.setMinutes(value.minute());
        value = start;

        _appointment.endTime = new Date(_appointment.endTime);
        end.setHours(_appointment.endTime.getHours());
        end.setMinutes(_appointment.endTime.getMinutes());

        if (start > end) {
          end = start;
          _appointment.endTime = start;
        }
        _appointment.duration = calcDuration(start, end);
        break;

      case "duration":
        value = value || 0;
        _appointment.endTime = new Date(_appointment.startTime);
        _appointment.endTime.setMinutes(
          _appointment.endTime.getMinutes() + parseInt(value)
        );
        break;

      case "date":
        value = new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
        );
        break;

      default:
        break;
    }

    _appointment[name] = value;
    const _isValid = schema.appointment.validate(_appointment).error
      ? false
      : true;
    setAppointment(_appointment);
    setIsValid(_isValid);
  };

  // onHide handler
  const handleHide = () => {
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

  return (
    <>
      <ConfirmDialog />
      <DialogTemp
        isValid={isValid}
        onHide={handleHide}
        onSubmit={handleSubmit}
        onDelete={handleDeleteConfim}
        header="Randevu Planla"
        style={{ width: "450px" }}
      >
        {/* Divider */}
        <Divider type="solid" className="mt-0" />

        {/* Dropdown Patients */}
        <div className="field mb-3">
          <DropdownPatient
            value={appointment.patient}
            options={patients}
            onChange={handleChange}
            onClickAdd={showPatientDialog}
          />
        </div>

        {/* Dropdown Doctors */}
        <div className="field mb-3">
          <DropdownDoctor
            value={appointment.doctor}
            options={doctors}
            onChange={handleChange}
            onClickAdd={showDoctorDialog}
          />
        </div>

        {/* Description */}
        <div className="field mb-3">
          <InputTextarea
            value={appointment.description ? appointment.description : ""}
            placeholder="Açıklama"
            name="description"
            onChange={handleChange}
            rows={5}
            cols={30}
          />
        </div>

        {/* Date */}
        <div className="flex grid align-items-center justify-content-center mb-3">
          {/* <label
            htmlFor="date"
            className="col-12 md:col-2 font-bold text-right"
          >
            Tarih <small className="p-error">*</small>
          </label> */}

          <DatePicker
            id="date"
            name="date"
            value={new Date(appointment.date)}
            onChange={(event) =>
              handleChange({ target: { name: "date", value: event } })
            }
          />
        </div>

        {/* Time */}
        <div className="flex grid align-items-center mb-3">
          <label className="col-12 md:col-2 font-bold text-right">
            Saat <small className="p-error">*</small>
          </label>

          <TimeRangePicker
            start={appointment.startTime}
            end={appointment.endTime}
            onChange={handleChange}
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
              name="duration"
              onChange={handleChange}
            />
          </div>
        </div>
      </DialogTemp>
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
