import React from "react";
import { Dialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";

function DialogTemp({ isValid, onHide, onSubmit, children, ...props }) {
  // HANDLERS -----------------------------------------------------------------
  // OnKeyDown handler
  const handleKeyDown = (event) => {
    if (isValid && event.key === "Enter") {
      onSubmit();
    }
  };

  // onHide handler
  const handleHide = () => {
    onHide();
  };

  // onSubmmit handler
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Dialog
      visible
      modal
      className="p-fluid"
      style={props.style}
      header={props.header}
      onHide={handleHide}
      onKeyDown={handleKeyDown}
      footer={
        <DialogFooter
          disabled={!isValid}
          onHide={handleHide}
          onSubmit={handleSubmit}
        />
      }
    >
      {children}
    </Dialog>
  );
}

export default DialogTemp;
