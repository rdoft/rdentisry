import React, { useEffect, useState } from "react";
import { Dialog, InputText, Divider } from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";

function DoctorDialog({ _doctor = {}, onHide, onSubmit }) {
  let emptyDoctor = {
    name: "",
    surname: "",
  };

  const [doctor, setDoctor] = useState({ ...emptyDoctor, ..._doctor });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const _isValid = doctor.name && doctor.surname;

    setIsValid(_isValid);
  }, [doctor]);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    const value = (event.target && event.target.value) || "";
    let _doctor = { ...doctor };

    if (attr === "name") {
      _doctor.name = value;
    } else if (attr === "surname") {
      _doctor.surname = value;
    }

    setDoctor(_doctor);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(doctor);
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Dialog
      visible
      header="Yeni Doktor"
      modal
      className="p-fluid"
      style={{ height: "fit-content" }}
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

      {/* Form */}
      <div className="flex">
        <div className="field mr-2">
          <label>Ad</label>
          <InputText
            id="name"
            value={doctor.name}
            onChange={(event) => handleChange(event, "name")}
          />
        </div>
        <div className="field ml-2">
          <label>Soyad</label>
          <InputText
            id="surname"
            value={doctor.surname}
            onChange={(event) => handleChange(event, "surname")}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default DoctorDialog;
