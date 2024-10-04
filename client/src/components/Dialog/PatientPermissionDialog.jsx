import React, { useState } from "react";
import { Checkbox, Divider } from "primereact";
import { DialogTemp } from "components/Dialog";

function PatientPermissionDialog({ initPermission, onHide, onSubmit }) {
  const [permission, setPermission] = useState({
    isSMS: false,
    ...initPermission,
  });

  // HANDLERS -----------------------------------------------------------------
  // onChange handler
  const handleChangeSMS = (event) => {
    setPermission({
      ...permission,
      isSMS: event.checked,
    });
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmit handler
  const handleSubmit = () => {
    onSubmit(permission);
  };

  return (
    <DialogTemp
      isValid={true}
      onHide={handleHide}
      onSubmit={handleSubmit}
      header="Hasta İzinleri"
      style={{ width: "450px" }}
    >
      {/* Divider */}
      <Divider type="solid" className="mt-0" />

      {/* SMS Permission */}
      <div className="flex align-items-center">
        <label htmlFor="isSMS" className="font-bold mr-3">
          SMS
        </label>
        <Checkbox
          name="isSMS"
          checked={permission.isSMS}
          onChange={handleChangeSMS}
        />
      </div>
    </DialogTemp>
  );
}

export default PatientPermissionDialog;
