import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { Chip, Dialog, Divider, InputNumber, Checkbox } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { DropdownPatient, DropdownProcedure } from "components/Dropdown";

// services
import { PatientService, ProcedureService } from "services";

function ProcedureDialog({ _patientProcedure = {}, onHide, onSubmit }) {
  const navigate = useNavigate();

  // Set default empty procedure
  let emptyPatientProcedure = {
    patient: null,
    procedure: null,
    invoice: null,
    toothNumber: 0,
  };

  const [patients, setPatients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [patientProcedure, setPatientProcedure] = useState({
    ...emptyPatientProcedure,
    ..._patientProcedure,
  });
  const [isAnother, setIsAnother] = useState(false);
  // Validation of payment object & properties
  const [isValid, setIsValid] = useState(false);

  // Set the doctors from dropdown on loading
  useEffect(() => {
    getProcedures();
    getPatients();
  }, []);

  // Set validation flags
  useEffect(() => {
    const _isValid =
      patientProcedure.patient &&
      patientProcedure.procedure &&
      patientProcedure.invoice?.amount >= 0;

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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
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
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    let value = event.value ?? event.target?.value;
    let _patientProcedure = { ...patientProcedure };

    if (attr === "patient") {
      _patientProcedure.patient = value;
    } else if (attr === "procedure") {
      _patientProcedure.procedure = value;
      _patientProcedure.invoice = {
        amount: value.price,
      };
    } else if (attr === "amount") {
      _patientProcedure.invoice.amount = value;
    } else if (attr === "quantity") {
      setQuantity(value);
    }

    setPatientProcedure(_patientProcedure);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    for (let i = 0; i < quantity; i++) {
      onSubmit(patientProcedure);
    }
    !isAnother && onHide();
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
    }
  };

  // onClickProcedureOptions handler
  const handleClickProcedureOptions = () => {
    navigate(`/procedures`);
  };

  return (
    <>
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
          />
        }
        onHide={handleHide}
        onKeyDown={handleKeyDown}
      >
        {/* Divider */}
        <Divider type="solid" className="mt-0" />

        {/* Dropdown Patients */}
        <div className="field mb-3">
          <DropdownPatient
            value={patientProcedure.patient}
            options={patients}
            onChange={(event) => handleChange(event, "patient")}
          />
        </div>

        {/* Dropdown Procedures */}
        <div className="field mb-4">
          <DropdownProcedure
            value={patientProcedure.procedure}
            options={procedures}
            onChange={(event) => handleChange(event, "procedure")}
            onClickOptions={handleClickProcedureOptions}
          />
        </div>

        {/* Price & Quantity */}
        <div className="flex grid align-items-center mb-4">
          <label htmlFor="amount" className="col-12 md:col-3 font-bold">
            Tutar <small className="p-error">*</small>
          </label>
          <div className="col-5 md:col-3 p-0">
            <InputNumber
              id="amount"
              value={
                patientProcedure.invoice ? patientProcedure.invoice.amount : 0
              }
              onValueChange={(event) => handleChange(event, "amount")}
              mode="currency"
              min={0}
              currency="TRY"
              locale="tr-TR"
            />
          </div>

          <label className="col-1 font-bold text-center">x</label>

          <div className="col-5 md:col-2 p-0">
            <InputNumber
              id="quantity"
              value={quantity}
              onChange={(event) => handleChange(event, "quantity")}
              useGrouping={false}
              mode="decimal"
              min={1}
              max={10}
              suffix=" adet"
            />
          </div>
        </div>

        {/* Tooth */}
        <div className="flex grid align-items-center mb-4">
          <label className="col-12 md:col-3 font-bold">Diş Numarası</label>
          <Chip
            label={patientProcedure.toothNumber || "Genel"}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #CED4D9",
            }}
          />
        </div>

        {/* Create another procedure */}
        <div className="flex align-items-center justify-content-end">
          <small className=" mr-2">Tedavi eklemeye devam et</small>
          <Checkbox
            onChange={(event) => setIsAnother(event.checked)}
            checked={isAnother}
          />
        </div>
      </Dialog>
    </>
  );
}

export default ProcedureDialog;
