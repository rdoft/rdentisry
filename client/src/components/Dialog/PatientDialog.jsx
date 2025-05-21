import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { InputText, Divider, ConfirmDialog, confirmDialog } from "primereact";
import { DialogTemp, PatientPermissionDialog } from "components/Dialog";
import { Basic } from "components/Button";
import { DialogFooter } from "components/DialogFooter";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";

import schema from "schemas/patient.schema";

function PatientDialog({ initPatient = {}, onHide, onSubmit, onDelete }) {
  const [patient, setPatient] = useState({
    id: null,
    idNumber: "",
    name: "",
    surname: "",
    phone: "",
    birthYear: "",
    isSMS: true,
    ...initPatient,
  });
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    idNumber: false,
    name: false,
    surname: false,
    phone: false,
    birtYear: false,
  });
  const [permissionDialog, setPermissionDialog] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { name, value } = event.target;

    // patient
    const _patient = {
      ...patient,
      [name]: value,
    };

    // error
    const _isError = {
      ...isError,
      [name]: schema[name].validate(value).error ? true : false,
    };

    // validation
    const _isValid = schema.patient.validate(_patient).error ? false : true;

    // Set isError and patient
    setPatient(_patient);
    setIsError(_isError);
    setIsValid(_isValid);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(patient);
  };

  // Show permission dialog
  const showPermissionDialog = () => {
    setPermissionDialog(true);
  };

  // Hide permission dialog
  const hidePermissionDialog = () => {
    setPermissionDialog(false);
  };

  // onSave permission dialog
  const handleSavePermission = (permission) => {
    setPatient({
      ...patient,
      isSMS: permission.isSMS,
    });
    hidePermissionDialog();
  };

  // onDelete handler
  const handleDelete = async () => {
    await onDelete(patient);
    handleHide();
  };

  const handleDeleteConfirm =
    onDelete &&
    (() => {
      confirmDialog({
        message: (
          <p>
            <strong>
              {patient.name} {patient.surname}
            </strong>{" "}
            isimli hastayı silmek istediğinizden emin misiniz?
          </p>
        ),
        header: "Hastayı Sil",
        footer: <DialogFooter onHide={handleHide} onDelete={handleDelete} />,
      });
    });

  return (
    <>
      <ConfirmDialog />
      <DialogTemp
        isValid={isValid}
        onHide={handleHide}
        onSubmit={handleSubmit}
        onDelete={handleDeleteConfirm}
        style={{ width: "450px" }}
        header={!patient.id ? "Yeni Hasta" : "Hasta Bilgileri"}
        controlSubscription
      >
        {/* Avatar icon */}
        <Avatar
          alt="patient-avatar"
          src={avatarPatient}
          sx={{ width: 100, height: 100, mb: 4, mx: "auto" }}
        />

        {/* TC */}
        <div className="field mb-3">
          <label htmlFor="idNumber" className="font-bold">
            TC Kimlik Numarası
          </label>
          <InputText
            id="idNumber"
            value={patient.idNumber || ""}
            name="idNumber"
            onChange={handleChange}
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
          <label htmlFor="name" className="font-bold">
            Ad <small className="p-error">*</small>
          </label>
          <InputText
            id="name"
            value={patient.name}
            name="name"
            onChange={handleChange}
            required
          />
          {isError["name"] && <small className="p-error">Zorunlu</small>}
        </div>

        {/* Surname */}
        <div className="field mb-3">
          <label htmlFor="surname" className="font-bold">
            Soyad <small className="p-error">*</small>
          </label>
          <InputText
            id="surname"
            value={patient.surname}
            name="surname"
            onChange={handleChange}
            required
          />
          {isError["surname"] && <small className="p-error">Zorunlu</small>}
        </div>

        {/* Phone */}
        <div className="field mb-3">
          <label htmlFor="phone" className="font-bold">
            Telefon <small className="p-error">*</small>
          </label>
          <InputText
            id="phone"
            value={patient.phone}
            name="phone"
            onChange={handleChange}
            required
            keyfilter="num"
            placeholder="5XXXXXXXXX"
          />
          {isError["phone"] && (
            <small className="p-error">Geçersiz telefon numarası</small>
          )}
        </div>

        {/* BirthYear */}
        <div className="field mb-3">
          <label htmlFor="birthYear" className="font-bold">
            Doğum yılı
          </label>
          <InputText
            id="birthYear"
            value={patient.birthYear || ""}
            name="birthYear"
            onChange={handleChange}
            keyfilter="num"
          />
          {isError["birthYear"] && (
            <small className="p-error">
              Geçersiz doğum yılı (1900-{new Date().getFullYear()})
            </small>
          )}
        </div>

        {/* Divider */}
        <Divider type="solid" className="mb-2" />

        {/* Permission */}
        <div className="field mb-3" style={{ width: "fit-content" }}>
          <Basic
            icon="pi pi-key"
            label="İzinler"
            variant="outlined"
            severity="primary"
            onClick={showPermissionDialog}
          />
        </div>
      </DialogTemp>
      {permissionDialog && (
        <PatientPermissionDialog
          initPermission={{ isSMS: patient.isSMS }}
          onHide={hidePermissionDialog}
          onSubmit={handleSavePermission}
        />
      )}
    </>
  );
}

export default PatientDialog;
