import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils";
import { Divider, InputNumber } from "primereact";
import { DropdownPatient } from "components/Dropdown";
import { DialogTemp } from "components/Dialog";
import { DatePicker } from "components/DateTime";

import schema from "schemas/payment.schema";

// services
import { PatientService } from "services";

function PaymentPlanDialog({ patient, onHide, onSubmit }) {
  const navigate = useNavigate();

  const [patients, setPatients] = useState(null);
  const [amount, setAmount] = useState(0);
  const [dates, setDates] = useState([new Date()]);

  // Validation of payments object & properties
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
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
    let { name, value } = event.target;
    let _isError = { ...isError };

    switch (name) {
      case "plannedDate":
        value.map(
          (date) =>
            new Date(date.getFullYear(), date.getMonth(), date.getDate())
        );
        _isError["date"] = value.length === 0;
        _isError["amount"] = value.length > amount ? true : false;

        setDates(value);
        break;
      case "amount":
        _isError["amount"] = schema[name].validate(value).error ? true : false;
        _isError["amount"] = dates.length > value ? true : false;
        setAmount(value);
        break;
      default:
        break;
    }

    // validation
    const _isValid = Object.values(_isError).every((e) => !e);
    setIsValid(_isValid);
    setIsError(_isError);
  };

  // onHide handler
  const handleHide = () => {
    setIsError({
      amount: false,
      date: false,
    });
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    let payments = [];
    let n = dates.length;
    let perAmount = Math.floor(amount / n);

    // Sort the dates
    dates.sort((a, b) => a - b);
    // Create payment plan
    for (let i = 0; i < n; i++) {
      if (i === n - 1) {
        perAmount = perAmount + (amount % n);
      }

      payments.push({
        patient: patient,
        amount: perAmount,
        plannedDate: dates[i],
      });
    }

    onSubmit(payments);
  };

  return (
    <DialogTemp
      isValid={isValid}
      onHide={handleHide}
      onSubmit={handleSubmit}
      header="Ödeme Planı"
      style={{ width: "500px" }}
    >
      {/* Divider */}
      <Divider />

      {/* Dropdown Patients */}
      <div className="field mb-4">
        <DropdownPatient
          value={patient}
          options={patients}
          name="patient"
          onChange={handleChange}
        />
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
            value={amount}
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
          <small className="grid m-1 font-light">Ödeme tarihlerini seçin</small>
        </label>

        {/* plannedDate */}
        <div className="col-12 md:col-8">
          <DatePicker
            id="plannedDate"
            className="m-0"
            mode="multiple"
            value={dates}
            onChange={(dates) =>
              handleChange({ target: { name: "plannedDate", value: dates } })
            }
            minDate={
              new Date(new Date().setUTCHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)
            }
          />
        </div>
      </div>
    </DialogTemp>
  );
}

export default PaymentPlanDialog;
