import React, { useState, useEffect } from "react";
import {
  Chip,
  Dialog,
  Dropdown,
  Divider,
  ConfirmDialog,
  confirmDialog,
} from "primereact";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import DialogFooter from "components/DialogFooter/DialogFooter";
import DropdownPersonItem from "components/DropdownItem/DropdownPersonItem";
import DropdownProcedureItem from "components/DropdownItem/DropdownProcedureItem";

// assets
import avatarPatient from "assets/images/avatars/patient-avatar.png";

// services
import { PatientService, ProcedureService } from "services";

function ProcedureDialog({
  _patientProcedure = {},
  onHide,
  onSubmit,
  onDelete,
}) {
  // Set default empty procedure
  let emptyPatientProcedure = {
    patient: null,
    procedure: null,
    toothNumber: 0,
  };

  const [patients, setPatients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [patientProcedure, setPatientProcedure] = useState({
    ...emptyPatientProcedure,
    ..._patientProcedure,
  });
  // Validation of payment object & properties
  const [isValid, setIsValid] = useState(false);

  // Set the doctors from dropdown on loading
  useEffect(() => {
    getProcedures();
    getPatients();
  }, []);

  // Set validation flags
  useEffect(() => {
    const _isValid = patientProcedure.patient && patientProcedure.procedure;

    setIsValid(_isValid);
  }, [patientProcedure]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of the procedures
  const getProcedures = async () => {
    let response;
    let procedures;

    try {
      response = await ProcedureService.getProcedures();
      procedures = response.data;

      setProcedures(procedures);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // Get the list of the patients
  const getPatients = async () => {
    let response;
    let patients;

    try {
      response = await PatientService.getPatients();
      patients = response.data;

      setPatients(patients);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    let value = event.target && event.target.value;
    let _patientProcedure = { ...patientProcedure };

    _patientProcedure[attr] = value;
    setPatientProcedure(_patientProcedure);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(patientProcedure);
  };

  // onDelete handler
  const handleDelete = () => {
    onDelete(patientProcedure);
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
    }
  };

  // onDeleteConfirm handler
  const handleDeleteConfirm =
    onDelete &&
    (() => {
      confirmDialog({
        message: "Tedaviyi silmek istediğinize emin misiniz?",
        header: "Tedaviyi Sil",
        footer: <DialogFooter onDelete={handleDelete} onHide={handleHide} />,
      });
    });

  // TEMPLATES ----------------------------------------------------------------
  // Patient dropdown item template
  const patientDropdownItem = (option, props) => {
    return (
      <DropdownPersonItem
        option={option}
        placeholder={props?.placeholder}
        avatar={avatarPatient}
      />
    );
  };

  // Procedure dropdown item template
  const procedureDropdownItem = (option, props) => {
    return (
      <DropdownProcedureItem
        option={option}
        placeholder={props?.placeholder}
        isValue={false}
      />
    );
  };
  // Procedure dropdown value template
  const procedureDropdownValue = (option, props) => {
    return (
      <DropdownProcedureItem
        option={option}
        placeholder={props?.placeholder}
        isValue={true}
      />
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog
        visible
        style={{ width: "600px" }}
        header="Yeni Tedavi"
        modal
        className="p-fluid"
        footer={
          <DialogFooter
            disabled={!isValid}
            onHide={handleHide}
            onSubmit={handleSubmit}
            onDelete={handleDeleteConfirm}
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
            value={patientProcedure.patient}
            options={patients}
            optionLabel="name"
            filter
            filterBy="name,surname,phone"
            placeholder="Hasta seçiniz..."
            valueTemplate={patientDropdownItem}
            itemTemplate={patientDropdownItem}
            onChange={(event) => handleChange(event, "patient")}
          />
        </div>

        {/* Dropdown Procedures */}
        <div className="field mb-4">
          <Dropdown
            value={patientProcedure.procedure}
            options={procedures}
            optionLabel="name"
            filter
            filterBy="name,code,procedureCategory.title"
            placeholder="Tedavi seçiniz..."
            valueTemplate={procedureDropdownValue}
            itemTemplate={procedureDropdownItem}
            onChange={(event) => handleChange(event, "procedure")}
          />
        </div>

        {/* Tooth */}
        <div className="flex grid align-items-center mb-3">
          <label className="col-12 md:col-3 font-bold">Diş Numarası</label>
          <Chip
            label={patientProcedure.toothNumber || "Genel"}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #CED4D9",
            }}
          />
        </div>
      </Dialog>
    </>
  );
}

export default ProcedureDialog;
