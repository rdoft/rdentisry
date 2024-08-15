import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Divider, InputNumber } from "primereact";
import { DropdownPatient } from "components/Dropdown";
import { DialogTemp } from "components/Dialog";
import { DatePicker } from "components/DateTime";
import { useLoading } from "context/LoadingProvider";

// schemas
import schema from "schemas/payment.schema";

// services
import { PatientService } from "services";

function PaymentPlanDialog({ patient, initAmount = 0, onHide, onSubmit }) {
  const { startLoading, stopLoading } = useLoading();

  const [patients, setPatients] = useState(null);
  const [instalment, setInstalment] = useState(1);
  const [amount, setAmount] = useState(initAmount);
  const [dates, setDates] = useState([]);

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

    startLoading("patients");
    PatientService.getPatients(null, { signal })
      .then((res) => {
        setPatients(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("patients"));

    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { name, value } = event.target;
    let _isError = { ...isError };
    let _dates = [...dates];
    let _amount = amount;
    let _instalment = instalment;
    let latestDate;

    switch (name) {
      case "plannedDate":
        value.map(
          (date) =>
            new Date(date.getFullYear(), date.getMonth(), date.getDate())
        );
        _dates = value;

        latestDate = new Date(Math.max.apply(null, _dates));
        if (dates.length === 0 && _dates.length === 1) {
          for (let i = 0; i < instalment - 1; i++) {
            _dates.push(
              new Date(latestDate.setMonth(latestDate.getMonth() + 1))
            );
          }
        }

        _isError["date"] = _dates.length === 0;
        _isError["amount"] = _dates.length > amount ? true : false;
        _isError["instalment"] = _dates.length !== instalment ? true : false;
        setDates(_dates);
        break;
      case "amount":
        _amount = value;

        _isError["amount"] = schema[name].validate(_amount).error
          ? true
          : false;
        _isError["amount"] = dates.length > _amount ? true : false;
        setAmount(_amount);
        break;
      case "instalment":
        _instalment = value < 1 ? 1 : value; // min value

        if (dates.length !== 0) {
          if (_instalment > dates.length) {
            latestDate = new Date(Math.max.apply(null, _dates));
            for (let i = 0; i < _instalment - dates.length; i++) {
              _dates.push(
                new Date(latestDate.setMonth(latestDate.getMonth() + 1))
              );
            }
          } else {
            _dates = _dates.slice(0, _instalment);
          }

          _isError["date"] = _dates.length === 0;
          _isError["amount"] = _dates.length > amount ? true : false;
          _isError["instalment"] = _dates.length !== _instalment ? true : false;
          setDates(_dates);
        }

        setInstalment(_instalment);
        break;
      default:
        break;
    }

    // validation
    const _isValid =
      _dates.length !== 0 &&
      _dates.length === _instalment &&
      _amount >= _instalment;
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
          key={patient?.id}
          name="patient"
          value={patient}
          options={patients}
          disabled
          style={{ alignItems: "center", height: "3rem" }}
        />
      </div>

      {/* Amount */}
      <div className="flex grid align-items-center mb-3">
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

      {/* Instalment */}
      <div className="flex grid mb-5">
        <label htmlFor="instalment" className="col-12 md:col-4 font-bold">
          Taksit <small className="p-error">*</small>
          {isError.instalment && (
            <small className="grid m-1 p-error font-light">
              Tarihler ve taksit sayısı eşleşmiyor
            </small>
          )}
        </label>
        <div className="col-12 md:col-8">
          <InputNumber
            id="instalment"
            name="instalment"
            value={instalment}
            onChange={(e) =>
              handleChange({
                target: { value: e.value, name: "instalment" },
              })
            }
            min={1}
            max={36}
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
          {dates.length === 0 ? (
            <small className="grid m-1 font-light">
              Taksit başlangıç tarihini seçin.
            </small>
          ) : (
            <small className="grid m-1 font-light">
              Taksitler otomatik belirlendi. Düzenlemek için yandaki takvimi
              kullanın.
            </small>
          )}
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
