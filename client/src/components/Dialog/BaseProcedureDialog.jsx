import React, { useState, useEffect } from "react";
import { InputText, InputNumber, Divider, Dialog, Checkbox } from "primereact";
import { DialogFooter } from "components/DialogFooter";
import { DropdownProcedureCategory } from "components/Dropdown";

import schema from "schemas/procedure.schema";

function ProcedureDialog({ _procedure = {}, categories, onHide, onSubmit }) {
  let emptyProcedure = {
    code: "",
    name: "",
    price: 0,
    procedureCategory: null,
  };

  const [procedure, setProcedure] = useState({
    ...emptyProcedure,
    ..._procedure,
  });
  const [isAnother, setIsAnother] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState({
    code: false,
    name: false,
    price: false,
  });

  useEffect(() => {
    const _isValid = !schema.procedure.validate(procedure).error;

    setIsValid(_isValid);
  }, [procedure]);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChange = (event, attr) => {
    const value = event.value ?? event.target?.value;
    let _procedure = { ...procedure };
    let _isError;

    // set procedure new value
    _procedure[attr] = value;

    // Set isError
    _isError = { ...isError };
    _isError[attr] = schema[attr].validate(value).error ? true : false;

    setIsError(_isError);
    setProcedure(_procedure);
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(procedure);
    !isAnother && onHide();
    setProcedure(emptyProcedure);
  };

  // onKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      handleSubmit();
    }
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
                onChange={(e) => handleChange(e, "code")}
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
                onChange={(e) => handleChange(e, "name")}
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
            onChange={(event) => handleChange(event, "procedureCategory")}
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
              value={procedure.price ?? 0}
              onValueChange={(event) => handleChange(event, "price")}
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
      </Dialog>
    </>
  );
}

export default ProcedureDialog;
