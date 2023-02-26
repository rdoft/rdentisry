import React, { useState } from "react";

import { Avatar } from "@mui/material";
import { classNames } from "primereact/utils";
import { Dialog, InputText } from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";

// import classes from "assets/styles/Patient.module.css";
import avatarPatient from "assets/images/avatars/patient-avatar.png";

function PatientDialog({ visible, patient, onChange, onHide, onSubmit }) {
  const [submitted, setSubmitted] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    const value = (event.target && event.target.value) || "";
    let _patient;

    _patient = { ...patient };
    _patient[`${attr}`] = value;

    onChange(_patient);
  };

  // onHide handler
  const handleHide = () => {
    setSubmitted(false);
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    setSubmitted(true);

    let _patient = {
      id: patient.id,
      idNumber: patient.idNumber.trim(),
      name: patient.name.trim(),
      surname: patient.surname.trim(),
      phone: patient.phone.trim(),
    };

    if (patient.idNumber && patient.name && patient.surname && patient.phone) {
      setSubmitted(false);
      onSubmit(_patient);
    }
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header={!patient.id ? "Yeni Hasta" : "Hasta Bilgileri"}
      modal
      className="p-fluid"
      footer={
        <DialogFooter
          onHide={handleHide}
          onSubmit={handleSubmit}
        />
      }
      onHide={handleHide}
    >
      {/* Avatar icon */}
      <Avatar
        alt="patient-avatar"
        src={avatarPatient}
        sx={{ width: 100, height: 100, mb: 2, mx: "auto" }}
      />
      {/* TC */}
      <div className="field">
        <label htmlFor="idNumber">TC Kimlik Numarası</label>
        <InputText
          id="idNumber"
          value={patient.idNumber}
          onChange={(event) => handleChange(event, "idNumber")}
          required
          autoFocus
          className={classNames({
            "p-invalid": submitted && !patient.idNumber,
          })}
        />
        {submitted && !patient.idNumber && (
          <small className="p-error">Gerekli</small>
        )}
      </div>
      {/* Name */}
      <div className="field">
        <label htmlFor="name">Ad</label>
        <InputText
          id="name"
          value={patient.name}
          onChange={(event) => handleChange(event, "name")}
          required
          className={classNames({ "p-invalid": submitted && !patient.name })}
        />
        {submitted && !patient.name && (
          <small className="p-error">Gerekli</small>
        )}
      </div>
      {/* Surname */}
      <div className="field">
        <label htmlFor="name">Soyad</label>
        <InputText
          id="surname"
          value={patient.surname}
          onChange={(event) => handleChange(event, "surname")}
          required
          className={classNames({
            "p-invalid": submitted && !patient.surname,
          })}
        />
        {submitted && !patient.surname && (
          <small className="p-error">Gerekli</small>
        )}
      </div>
      {/* Phone */}
      <div className="field">
        <label htmlFor="phone">Telefon</label>
        <InputText
          id="phone"
          value={patient.phone}
          onChange={(event) => handleChange(event, "phone")}
          required
          className={classNames({ "p-invalid": submitted && !patient.phone })}
        />
        {submitted && !patient.phone && (
          <small className="p-error">Gerekli</small>
        )}
      </div>
    </Dialog>
  );
}

export default PatientDialog;
