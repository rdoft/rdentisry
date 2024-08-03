import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography, Tooltip, ClickAwayListener } from "@mui/material";
import { InputText } from "primereact";
import { Cancel } from "components/Button";

// assets
import { useTheme } from "@mui/material/styles";

function VisitTitle({ visit, onSubmit }) {
  const theme = useTheme();

  const prevTitle = useRef(visit.title);
  const [title, setTitle] = useState(visit.title);
  const [isEdit, setIsEdit] = useState(false);

  // Update component state when visit prop changes
  useEffect(() => {
    if (!isEdit) {
      setTitle(visit.title);
      prevTitle.current = visit.title;
    }
  }, [visit, isEdit]);

  // HANDLERS -----------------------------------------------------------------
  // onEdit handler
  const handleEdit = () => {
    setIsEdit(true);
  };

  // onChange handler
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  // onSave handler, to save changes
  const handleSave = () => {
    if (!title.trim()) {
      setTitle(prevTitle.current);
    } else {
      prevTitle.current = title;
      onSubmit(title);
    }
    setIsEdit(false);
  };

  // onCancel handler, discard changes to title
  const handleCancel = () => {
    setTitle(prevTitle.current);
    setIsEdit(false);
  };

  // onKeyDown handler, save the title on Enter and discard changes on Escape
  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSave();
    else if (event.key === "Escape") handleCancel();
  };

  // handleClickAway handler, save the title
  const handleClickAway = () => {
    handleSave();
  };

  return isEdit ? (
    <Grid container alignItems="center" m={"-16px"}>
      <Grid item xs={6} m={1}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <InputText
            id="title"
            value={title}
            variant="outlined"
            autoFocus={true}
            className="w-full"
            style={{ padding: "9px" }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </ClickAwayListener>
      </Grid>
      <Grid item>
        <Cancel onClick={handleCancel} />
      </Grid>
    </Grid>
  ) : (
    <Tooltip title="Başlığı düzenle" placement="bottom-start" enterDelay={500}>
      <Grid
        container
        item
        onClick={handleEdit}
        xs={6}
        p={1}
        m={-1}
        sx={{
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: theme.palette.background.primary,
          },
        }}
      >
        <Typography variant="h5" fontWeight="bolder">
          {title || "-"}
        </Typography>
      </Grid>
    </Tooltip>
  );
}

export default VisitTitle;
