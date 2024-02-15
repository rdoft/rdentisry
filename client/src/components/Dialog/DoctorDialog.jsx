import React, { useState } from "react";
import { Dialog, InputText, Divider } from "primereact";
import { DialogFooter } from "components/DialogFooter";

function DoctorDialog({ initDoctor = {}, onHide, onSubmit }) {
  const [doctor, setDoctor] = useState({
    name: "",
    surname: "",
    ...initDoctor,
  });
  const [isValid, setIsValid] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { name, value } = event.target;

    // doctor
    const _doctor = {
      ...doctor,
      [name]: value,
    };

    // validation
    const _isValid = _doctor.name && _doctor.surname;

    setDoctor(_doctor);
    setIsValid(_isValid);
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
          <label className="font-bold">
            Ad <small className="p-error">*</small>
          </label>
          <InputText
            id="name"
            value={doctor.name}
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className="field ml-2">
          <label className="font-bold">
            Soyad <small className="p-error">*</small>
          </label>
          <InputText
            id="surname"
            value={doctor.surname}
            name="surname"
            onChange={handleChange}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default DoctorDialog;
