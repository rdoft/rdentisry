import React, { useState } from "react";
import { InputText, InputNumber, Divider, Checkbox } from "primereact";
import { DropdownProcedureCategory } from "components/Dropdown";
import { DialogTemp } from "components/Dialog";

import schema from "schemas/procedure.schema";

function BaseProcedureDialog({
  initProcedure = {},
  categories,
  onHide,
  onSubmit,
}) {
  const [procedure, setProcedure] = useState({
    code: "",
    name: "",
    price: 0,
    procedureCategory: null,
    ...initProcedure,
  });
  const [isAnother, setIsAnother] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    code: false,
    name: false,
    price: false,
  });

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event) => {
    let { value, name } = event.target;

    if (name === "price") {
      value = value || 0;
    }

    // procedure
    const _procedure = {
      ...procedure,
      [name]: value,
    };

    // error
    const _isError = {
      ...isError,
      [name]: schema[name].validate(value).error ? true : false,
    };

    // validation
    const _isValid = schema.procedure.validate(_procedure).error ? false : true;

    setProcedure(_procedure);
    setIsError(_isError);
    setIsValid(_isValid);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(procedure);
    !isAnother && onHide();
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

      {/* Code - Name*/}
      <div className="flex grid align-center justify-content-between mb-4">
        {/* Code */}
        <div className="col-12 md:col-3">
          <label htmlFor="code" className="font-bold">
            Kod <small className="p-error">*</small>
          </label>
          <div className="mt-2">
            <InputText
              id="code"
              value={procedure.code}
              name="code"
              onChange={handleChange}
              className="w-full"
            />
            {isError["code"] && <small className="p-error">Zorunlu</small>}
          </div>
        </div>

        {/* Name */}
        <div className="col-12 md:col-9">
          <label htmlFor="name" className="font-bold">
            Ad <small className="p-error">*</small>
          </label>
          <div className="mt-2">
            <InputText
              id="name"
              value={procedure.name}
              name="name"
              onChange={handleChange}
              className="w-full"
            />
            {isError["name"] && <small className="p-error">Zorunlu</small>}
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="field mb-4">
        <DropdownProcedureCategory
          value={procedure.procedureCategory}
          options={categories}
          onChange={handleChange}
        />
      </div>

      {/* Price */}
      <div className="flex grid align-items-center mb-4">
        <div className="col-12 md:col-2">
          <label htmlFor="price" className="font-bold">
            Tutar <small className="p-error">*</small>
          </label>
        </div>
        <div className="col-6 md:col-4">
          <InputNumber
            id="price"
            value={procedure.price}
            name="price"
            onChange={(e) =>
              handleChange({
                target: { value: e.value, name: "price" },
              })
            }
            mode="currency"
            min={0}
            currency="TRY"
            locale="tr-TR"
          />
          {isError["price"] && <small className="p-error">Zorunlu</small>}
        </div>
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

export default BaseProcedureDialog;
