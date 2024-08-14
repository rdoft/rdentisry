import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Divider, InputNumber, Checkbox } from "primereact";
import { Tooth } from "components/Button";
import { DialogTemp } from "components/Dialog";
import { DropdownPatient, DropdownProcedure } from "components/Dropdown";
import { useLoading } from "context/LoadingProvider";

// schemas
import schema from "schemas/procedure.schema";

// services
import { PatientService, ProcedureService } from "services";
import DropdownTooth from "components/Dropdown/DropdownTooth";

function ProcedureDialog({
  initPatientProcedure = {},
  visit,
  onHide,
  onSubmit,
  selectedTeeth,
  onChangeTeeth,
}) {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  const [patients, setPatients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isAnother, setIsAnother] = useState(false);
  const [patientProcedure, setPatientProcedure] = useState({
    patient: null,
    procedure: null,
    ...initPatientProcedure,
  });
  // Validations
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    quantity: false,
    amount: false,
  });

  const adultTeeth = [
    11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33,
    34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
  ];
  const childTeeth = [
    51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83, 84,
    85,
  ];
  const teeth = [
    {
      label: "Yetişkin",
      code: "A",
      items: adultTeeth
        .filter((tooth) => !selectedTeeth.includes(tooth))
        .map((tooth) => ({
          label: tooth ? tooth : "Genel",
          value: tooth,
        })),
    },
    {
      label: "Çocuk",
      code: "C",
      items: childTeeth
        .filter((tooth) => !selectedTeeth.includes(tooth))
        .map((tooth) => ({
          label: tooth ? tooth : "Genel",
          value: tooth,
        })),
    },
  ];

  // Set the doctors from dropdown on loading
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

    startLoading("procedures");
    ProcedureService.getProcedures(null, { signal })
      .then((res) => {
        setProcedures(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("procedures"));

    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { value, name } = event.target;
    let _isError = { ...isError };
    let _patientProcedure;

    if (name === "procedure") {
      _patientProcedure = {
        ...patientProcedure,
        procedure: value,
        price: value.price,
      };
    } else if (name === "amount") {
      _patientProcedure = {
        ...patientProcedure,
        price: value,
      };
      _isError.amount = schema.price.validate(value).error ? true : false;
    } else if (name === "quantity") {
      setQuantity(value);
      _patientProcedure = { ...patientProcedure };
      _isError.quantity = value < 1;
    }

    const _isValid =
      _patientProcedure.patient &&
      _patientProcedure.procedure &&
      !_isError.amount &&
      !_isError.quantity;

    setPatientProcedure(_patientProcedure);
    setIsError(_isError);
    setIsValid(_isValid);
  };

  // onAddTeeth handler
  const handleAddTooth = (tooth) => {
    if (!selectedTeeth.includes(tooth) && tooth) {
      onChangeTeeth([...selectedTeeth, tooth]);
    }
  };

  // onRemoveTeeth handler
  const handleRemoveTooth = (tooth) => {
    onChangeTeeth(selectedTeeth.filter((number) => number !== tooth));
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = async () => {
    let patientProcedures = [];
    for (let i = 0; i < quantity; i++) {
      for (let tooth of selectedTeeth) {
        patientProcedures.push({
          ...patientProcedure,
          toothNumber: tooth,
          visit: visit,
        });
      }
    }

    await onSubmit(patientProcedures);
    // Close the dialog unless isAnother selected
    !isAnother && onHide();
  };

  // onClickProcedureOptions handler
  const handleClickProcedureOptions = () => {
    navigate(`/procedures`);
  };

  return (
    <DialogTemp
      isValid={isValid}
      onHide={handleHide}
      onSubmit={handleSubmit}
      header="Yeni Tedavi"
      style={{ width: "600px" }}
    >
      {/* Divider */}
      <Divider type="solid" className="mt-0" />

      {/* Dropdown Patients */}
      <div className="field mb-3">
        <DropdownPatient
          key={patientProcedure.patient?.id}
          value={patientProcedure.patient}
          options={patients}
          disabled
        />
      </div>

      {/* Dropdown Procedures */}
      <div className="field mb-4">
        <DropdownProcedure
          key={patientProcedure.procedure?.id}
          value={patientProcedure.procedure}
          options={procedures}
          onChange={handleChange}
          onClickOptions={handleClickProcedureOptions}
        />
      </div>

      {/* Price & Quantity */}
      <div className="flex grid align-items-center mb-4">
        <label htmlFor="amount" className="col-12 md:col-3 font-bold">
          Tutar <small className="p-error">*</small>
          {isError.amount && (
            <small className="ml-3 p-error font-light">Zorunlu</small>
          )}
        </label>
        <div className="col-5 md:col-3 p-0">
          <InputNumber
            id="amount"
            value={patientProcedure.price}
            name="amount"
            onChange={(e) =>
              handleChange({
                target: { value: e.value, name: "amount" },
              })
            }
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
            name="quantity"
            onChange={(e) =>
              handleChange({
                target: { value: e.value, name: "quantity" },
              })
            }
            useGrouping={false}
            mode="decimal"
            min={0}
            max={10}
            suffix=" adet"
          />
        </div>
        {isError.quantity && (
          <small className="ml-3 p-error font-light">Min. 1 adet</small>
        )}
      </div>

      {/* Tooth */}
      <div className="flex grid align-items-center mb-4">
        <label className="col-12 md:col-3 font-bold">Dişler</label>
        {selectedTeeth.map((tooth) => (
          <Tooth
            key={tooth}
            number={tooth}
            removable={tooth !== 0}
            onRemove={() => handleRemoveTooth(tooth)}
          />
        ))}

        <DropdownTooth
          options={teeth}
          onChange={(e) => handleAddTooth(e.value)}
          style={{
            alignItems: "center",
            width: "7rem",
            height: "1.7rem",
            margin: "0.3rem",
            borderRadius: "0.5rem",
            fontSize: "small",
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
    </DialogTemp>
  );
}

export default ProcedureDialog;
