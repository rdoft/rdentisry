import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { Divider, InputNumber, ConfirmDialog, confirmDialog } from "primereact";
import { DropdownPatient } from "components/Dropdown";
import { DialogTemp } from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { DatePicker } from "components/DateTime";
import PaymentType from "components/PatientDetail/Payments/PaymentType";

import schema from "schemas/payment.schema";

// services
import { PatientService } from "services";

function PaymentDialog({ initPayment = {}, onHide, onSubmit, onDelete }) {
  const navigate = useNavigate();

  const [patients, setPatients] = useState(null);
  const [payment, setPayment] = useState({
    patient: null,
    type: "",
    amount: 0,
    plannedDate: null,
    actualDate: new Date(),
    ...initPayment,
  });
  // Validation of payment object & properties
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    patient: false,
    type: false,
    amount: false,
    date: false,
  });

  // Set the patients from dropdown on loading
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

    return () => {
      controller.abort();
    };
  }, [navigate]);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { value, name } = event.target;
    let _isError = { ...isError };

    switch (name) {
      case "actualDate":
        value = value
          ? new Date(
              Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
            )
          : null;

        _isError["date"] =
          schema[name].validate(value).error || !value ? true : false;
        break;
      case "amount":
        _isError[name] = schema[name].validate(value).error ? true : false;
        break;
      case "type":
        _isError[name] = schema[name].validate(value).error ? true : false;
        break;
      default:
        break;
    }

    // payment
    const _payment = {
      ...payment,
      [name]: value,
    };

    // validation
    const _isValid = schema.payment.validate(_payment).error ? false : true;

    setPayment(_payment);
    setIsError(_isError);
    setIsValid(_isValid);
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
    onSubmit(payment);
  };

  // onDelete handler
  const handleDelete = () => {
    onDelete(payment);
  };

  // onDeleteConfirm handler
  const handleDeleteConfim =
    onDelete &&
    (() => {
      confirmDialog({
        message: "Ödemeyi silmek istediğinize emin misiniz?",
        header: "Ödemeyi Sil",
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
        onDelete={handleDeleteConfim}
        header={!payment.id ? "Yeni Ödeme" : "Ödeme Bilgileri"}
        style={{ width: "500px" }}
      >
        {/* Divider */}
        <Divider type="solid" className="mt-0" />

        {/* Dropdown Patients */}
        <div className="field mb-4">
          <DropdownPatient
            value={payment.patient}
            options={patients}
            name="patient"
            onChange={handleChange}
          />
        </div>

        {/* Type */}
        <div className="flex grid align-items-center mb-3">
          <label htmlFor="type" className="col-12 md:col-4 font-bold">
            Ödeme Türü
          </label>
          <div className="col-6 md:col-8 card flex flex-row align-items-center gap-2">
            <PaymentType type={payment.type} onChange={handleChange} />
          </div>
        </div>

        {/* Amount */}
        <div className="flex grid align-items-center mb-5">
          <label htmlFor="amount" className="col-12 md:col-4 font-bold">
            Tutar <small className="p-error">*</small>
            {isError.amount && (
              <small className="ml-3 p-error font-light">Geçersiz</small>
            )}
          </label>
          <div className="col-12 md:col-8">
            <InputNumber
              id="amount"
              value={payment.amount}
              name="amount"
              onChange={(e) =>
                handleChange({
                  target: { value: e.value, name: "amount" },
                })
              }
              mode="currency"
              currency="TRY"
              locale="tr-TR"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex grid mb-3">
          <label htmlFor="date" className="col-12 md:col-4 font-bold">
            Tarih <small className="p-error">*</small>
            {isError.date && (
              <small className="ml-3 p-error font-light">Zorunlu</small>
            )}
          </label>

          {/* ActualDate */}
          <div className="col-12 md:col-8">
            <DatePicker
              id="actualDate"
              className="m-0"
              value={payment.actualDate && new Date(payment.actualDate)}
              onChange={(event) =>
                handleChange({ target: { name: "actualDate", value: event } })
              }
              required
              defaultMonth={payment.actualDate && new Date(payment.actualDate)}
            />
          </div>
        </div>
      </DialogTemp>
    </>
  );
}

export default PaymentDialog;
