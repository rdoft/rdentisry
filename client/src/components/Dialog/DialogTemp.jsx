import React from "react";
import { Dialog } from "primereact";
import { ClickAwayListener } from "@mui/material";
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

  // onClickAway handler
  const handleClickAway = () => {
    onHide();
  };

  // mouseClick handler
  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Dialog
        visible
        modal
        className="p-fluid"
        position="bottom-right"
        style={props.style}
        header={props.header}
        onHide={handleHide}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
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
    </ClickAwayListener>
  );
}

export default DialogTemp;
