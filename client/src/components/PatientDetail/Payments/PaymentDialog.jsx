import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import {
  Dialog,
  Divider,
  Calendar,
  Checkbox,
  InputNumber,
  ConfirmDialog,
  confirmDialog,
  MultiStateCheckbox,
} from "primereact";
import DialogFooter from "components/DialogFooter/DialogFooter";
import DropdownPatient from "components/Dropdown/DropdownPatient";

import schema from "schemas/payment.schema";

// services
import { PatientService } from "services";

function PaymentDialog({ _payment = {}, onHide, onSubmit, onDelete }) {
  const navigate = useNavigate();

  // Set default empty Payment
  let emptyPayment = {
    patient: null,
    type: "",
    amount: 0,
    plannedDate: null,
    actualDate: null,
  };

  const [reduce, setReduce] = useState(false);
  const [patients, setPatients] = useState(null);
  const [payment, setPayment] = useState({
    ...emptyPayment,
    ..._payment,
  });
  // Validation of payment object & properties
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    patient: false,
    type: false,
    amount: false,
    plannedDate: false,
    actualDate: false,
  });

  // Set the patients from dropdown on loading
  useEffect(() => {
    getPatients();
  }, []);

  // Set validation flags
  useEffect(() => {
    const _isValid = !schema.payment.validate(payment).error;

    setIsValid(_isValid);
  }, [payment]);

  // Payment types
  const paymentTypes = [
    { value: "cash", label: "Nakit", icon: "pi pi-wallet" },
    { value: "card", label: "Kredi Kartı", icon: "pi pi-credit-card" },
    {
      value: "transfer",
      label: "Transfer(Banka)",
      icon: "pi pi-arrow-right-arrow-left",
    },
    { value: "other", label: "Diğer", icon: "pi pi-file" },
  ];

  // Set label of the paymentType
  const getTypeLabel = (type) => {
    const type_ = paymentTypes.find((item) => item.value === type);
    return type_.label;
  };

  // SERVICES -----------------------------------------------------------------
  // Get the list of patients and set patients value
  const getPatients = async () => {
    let response;
    let patients;

    try {
      // GET /patients
      response = await PatientService.getPatients();
      patients = response.data;
      // Set new patients
      setPatients(patients);
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
    let _payment = { ...payment };

    if (attr === "plannedDate" || attr === "actualDate") {
      value =
        value &&
        new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
        );
      _isError[attr] = schema[attr].validate(value).error ? true : false;
    } else if (attr === "amount" || attr === "type") {
      _isError[attr] = schema[attr].validate(value).error ? true : false;
    }

    _payment[attr] = value;
    setIsError(_isError);
    setPayment(_payment);
  };

  // onHide handler
  const handleHide = () => {
    setIsError({
      patient: false,
      type: false,
      amount: false,
      plannedDate: false,
      actualDate: false,
    });
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(payment, reduce);
  };

  // onDelete handler
  const handleDelete = () => {
    onDelete(payment);
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
    }
  };

  // onDeleteConfirm handler
  const handleDeleteConfim =
    onDelete &&
    (() => {
      confirmDialog({
        message: "Ödemeyi silmek istediğinizden emin misiniz?",
        header: "Ödemeyi Sil",
        footer: <DialogFooter onHide={handleHide} onDelete={handleDelete} />,
      });
    });

  return (
    <>
      <ConfirmDialog />
      <Dialog
        visible
        style={{ width: "450px" }}
        header={!payment.id ? "Yeni Ödeme" : "Ödeme Bilgileri"}
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
        <div className="field mb-4">
          <DropdownPatient
            value={payment.patient}
            options={patients}
            onChange={(event) => handleChange(event, "patient")}
          />
        </div>

        {/* Type */}
        <div className="flex grid align-items-center mb-3">
          <label htmlFor="type" className="col-12 md:col-6 font-bold">
            Ödeme Türü
          </label>
          <div className="col-6 md:col-6 card flex flex-row align-items-center gap-2">
            <MultiStateCheckbox
              value={payment.type}
              onChange={(event) => handleChange(event, "type")}
              options={paymentTypes}
              optionValue="value"
            />

            <small>
              {payment.type ? (
                getTypeLabel(payment.type)
              ) : (
                <label>Seçiniz</label>
              )}
            </small>
          </div>
        </div>

        {/* Amount */}
        <div className="flex grid align-items-center mb-3">
          <label htmlFor="amount" className="col-12 md:col-6 font-bold">
            Tutar <small className="p-error">*</small>
          </label>
          <div className="col-12 md:col-6 p-0">
            <InputNumber
              id="amount"
              value={payment.amount}
              onValueChange={(event) => handleChange(event, "amount")}
              mode="currency"
              currency="TRY"
              locale="tr-TR"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex grid align-items-center justify-content-between mb-3">
          <label htmlFor="date" className="col-12 font-bold">
            Tarih <small className="p-error">*</small>
            {isError["plannedDate"] && isError["actualDate"] && (
              <small className="ml-3 p-error font-light">
                Tarihlerden en az biri seçilmelidir
              </small>
            )}
          </label>

          <small className="col-6 py-0">Planlanan</small>
          <small className="col-6 py-0">Gerçekleşen</small>
          {/* PlannedDate */}
          <Calendar
            id="plannedDate"
            className="col-6"
            value={payment.plannedDate && new Date(payment.plannedDate)}
            onChange={(event) => handleChange(event, "plannedDate")}
            dateFormat="dd/mm/yy"
            minDate={new Date(new Date().setUTCHours(24, 0, 0, 0))}
            showButtonBar
          />

          {/* ActualDate */}
          <Calendar
            id="actualDate"
            className="col-6"
            value={payment.actualDate && new Date(payment.actualDate)}
            onChange={(event) => handleChange(event, "actualDate")}
            dateFormat="dd/mm/yy"
            showButtonBar
          />
        </div>

        {/* Reduce from next payment */}
        {!payment.id && !payment.plannedDate && payment.actualDate && (
          <div className="flex align-items-center justify-content-end mb-3">
            <small className=" mr-2">Planlanan ödemeden düşülsün</small>
            <Checkbox
              onChange={(event) => setReduce(event.checked)}
              checked={reduce}
            />
          </div>
        )}
      </Dialog>
    </>
  );
}

export default PaymentDialog;
