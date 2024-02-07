import React, { useRef, useState } from "react";
import { Grid, Typography, ClickAwayListener } from "@mui/material";
import { InputText, Button } from "primereact";

function NameColumn({ procedure, onSubmit }) {
  const prevName = useRef(procedure.name);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(procedure.name);

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
  };

  // onChange handler
  const handleChange = (event) => {
    const value = event.target.value;
    setName(value);
  };

  // onSave handler, to save changes
  const handleSave = () => {
    if (!name.trim()) {
      setName(prevName.current);
    } else {
      prevName.current = name;
      procedure.name = name;
      onSubmit(procedure);
    }

    setIsEdit(false);
  };

  // onCancel handler, discard changes to name
  const handleCancel = () => {
    setName(prevName.current);
    setIsEdit(false);
  };

  // onKeyDown handler, save the name on Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  // handleClickAway handler, save the name
  const handleClickAway = () => {
    handleSave();
  };

  return isEdit ? (
    <Grid container alignItems="center" m={"-16px"}>
      <Grid item xs={9} m={1}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <InputText
            id="name"
            value={name}
            variant="outlined"
            autoFocus={true}
            className="w-full"
            style={{ padding: "8px" }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </ClickAwayListener>
      </Grid>
      <Grid item xs>
        <Button
          icon="pi pi-times"
          size="small"
          severity="secondary"
          text
          onClick={handleCancel}
        />
      </Grid>
    </Grid>
  ) : (
    <Grid container onClick={handleEdit}>
      <Typography variant="h5" fontWeight="regular">
        {name || "-"}
      </Typography>
    </Grid>
  );
}

export default NameColumn;
