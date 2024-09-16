import React, { useRef, useState } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputText } from "primereact";
import { Cancel } from "components/Button";

function NameColumn({ procedure, onSubmit }) {
  const prevName = useRef(procedure.name);
  const [name, setName] = useState(procedure.name);
  const [isEdit, setIsEdit] = useState(false);

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
      onSubmit({
        ...procedure,
        name: name,
      });
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
      <Grid item xs={9}>
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
      <Grid item xs={2}>
        <Cancel onClick={handleCancel} />
      </Grid>
    </Grid>
  ) : (
    <Tooltip title="Adı düzenle" placement="bottom-start" enterDelay={500}>
      <Grid
        container
        item
        onClick={handleEdit}
        xs={9}
        p={1}
        m={-1}
        sx={{
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "white",
          },
        }}
      >
        <Typography variant="h5" fontWeight="regular">
          {name || "-"}
        </Typography>
      </Grid>
    </Tooltip>
  );
}

export default NameColumn;
