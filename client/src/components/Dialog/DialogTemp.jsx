import React from "react";
import { Dialog } from "primereact";
import { ClickAwayListener, useTheme } from "@mui/material";
import { DialogFooter } from "components/DialogFooter";
import config from "config/theme.config";

// assets
import "assets/styles/Other/Dialog.css";
import "assets/styles/Other/ConfirmDialog.css";

function DialogTemp({
  children,
  isValid,
  onHide,
  onSubmit,
  onDelete,
  ...props
}) {
  const theme = useTheme();
  const dialogZIndex = theme.zIndex?.dialog || config.zIndex?.dialog || 1400;

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
        position={props.position || "bottom-right"}
        style={{
          ...props.style,
          zIndex: dialogZIndex,
        }}
        header={props.header}
        onHide={handleHide}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        footer={
          <DialogFooter
            labelSubmit={props.labelSubmit}
            labelHide={props.labelHide}
            disabled={!isValid}
            onHide={handleHide}
            onSubmit={handleSubmit}
            onDelete={onDelete && handleDelete}
            controlSubscription={props.controlSubscription}
          />
        }
        maskStyle={{
          backdropFilter: "blur(4px)",
          backgroundColor: theme.palette.background.default,
          zIndex: dialogZIndex - 1,
        }}
        breakpoints={{ '960px': '80vw', '640px': '90vw' }}
        blockScroll
      >
        {children}
      </Dialog>
    </ClickAwayListener>
  );
}

export default DialogTemp;
