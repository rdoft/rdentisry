import React from "react";
import { Dialog } from "primereact";
import { DialogFooter } from "components/DialogFooter";

function DialogTemp({
  children,
  isValid,
  onHide,
  onSubmit,
  onDelete,
  ...props
}) {
  // HANDLERS -----------------------------------------------------------------
  // OnKeyDown handler
  const handleKeyDown = (event) => {
    if (
      isValid &&
      event.key === "Enter" &&
      event.target.tagName !== "TEXTAREA"
    ) {
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

  // onDelete handler
  const handleDelete = () => {
    onDelete();
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
          onDelete={onDelete && handleDelete}
        />
      }
    >
      {children}
    </Dialog>
  );
}

export default DialogTemp;
