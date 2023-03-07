import React, { useState, useEffect } from "react";

import { Avatar } from "@mui/material";
// import { classNames } from "primereact/utils";
import { Dialog, InputText } from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";

import schema from "schemas/patient.schema";

// import classes from "assets/styles/Patient.module.css";
import avatarPatient from "assets/images/avatars/patient-avatar.png";

function PatientDialog({ visible, patient, onChange, onHide, onSubmit }) {
  // Validation of patient object
  const [isValid, setIsValid] = useState(false);
  // Validation(error) of patient properties
  const [isError, setIsError] = useState({
    idNumber: false,
    name: false,
    surname: false,
    phone: false,
    birtYear: false,
  });

  useEffect(() => {
    const _isValid = !schema.patient.validate(patient).error;

    setIsValid(_isValid);
  }, [patient]);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    const value = (event.target && event.target.value) || "";
    let _patient;
    let _isError;

    // set patient new value
    _patient = { ...patient };
    _patient[`${attr}`] = value;

    // Set isError
    _isError = { ...isError };
    _isError[`${attr}`] = schema[`${attr}`].validate(value).error
      ? true
      : false;

    // Set isError and patient
    setIsError(_isError);
    onChange(_patient);
  };

  // onHide handler
  const handleHide = () => {
    setIsError({
      idNumber: false,
      name: false,
      surname: false,
      phone: false,
      birtYear: false,
    });
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(patient);
  };

  // onSubmit handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
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
          disabled={!isValid}
          onHide={handleHide}
          onSubmit={handleSubmit}
        />
      }
      onHide={handleHide}
      onKeyDown={handleKeyDown}
    >
      {/* Avatar icon */}
      <Avatar
        alt="patient-avatar"
        src={avatarPatient}
        sx={{ width: 100, height: 100, mb: 4, mx: "auto" }}
      />

      {/* TC */}
      <div className="field mb-3">
        <label htmlFor="idNumber">TC Kimlik Numarası</label>
        <InputText
          id="idNumber"
          value={patient.idNumber}
          onChange={(event) => handleChange(event, "idNumber")}
          required
          autoFocus
          keyfilter="num"
        />
        {isError["idNumber"] && (
          <small id="username-help" className="p-error">
            Geçersiz kimlik numarası
          </small>
        )}
      </div>

      {/* Name */}
      <div className="field mb-3">
        <label htmlFor="name">Ad</label>
        <InputText
          id="name"
          value={patient.name}
          onChange={(event) => handleChange(event, "name")}
          required
          keyfilter="alpha"
        />
        {isError["name"] && <small className="p-error">Zorunlu</small>}
      </div>

      {/* Surname */}
      <div className="field mb-3">
        <label htmlFor="name">Soyad</label>
        <InputText
          id="surname"
          value={patient.surname}
          onChange={(event) => handleChange(event, "surname")}
          required
          keyfilter="alpha"
        />
        {isError["surname"] && <small className="p-error">Zorunlu</small>}
      </div>

      {/* Phone */}
      <div className="field mb-3">
        <label htmlFor="phone">Telefon</label>
        <InputText
          id="phone"
          value={patient.phone}
          onChange={(event) => handleChange(event, "phone")}
          required
          keyfilter="num"
          placeholder="(ÖR: 5554443322)"
        />
        {isError["phone"] && (
          <small className="p-error">Geçersiz telefon numarası</small>
        )}
      </div>

      {/* BirthYear */}
      <div className="field">
        <label htmlFor="birthYear">Doğum yılı</label>
        <InputText
          id="birthYear"
          value={patient.birthYear}
          onChange={(event) => handleChange(event, "birthYear")}
          keyfilter="num"
        />
        {isError["birthYear"] && (
          <small className="p-error">Geçersiz doğum yılı (1900-{new Date().getFullYear()})</small>
        )}
      </div>
    </Dialog>
  );
}

export default PatientDialog;
