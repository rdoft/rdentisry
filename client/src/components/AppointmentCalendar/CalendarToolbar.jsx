import React from "react";
import { Toolbar, Button, InputSwitch } from "primereact";
import { Typography, Grid } from "@mui/material";

function CalendarToolbar({ onClickAdd, checked, setChecked }) {
  // HANDLERS -----------------------------------------------------------------
  // onChange handler for set checked
  const handleChange = (event) => {
    setChecked(event.value);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Get switch for showAll appointments
  const inputSwitch = () => (
    <React.Fragment>
      <Typography variant="subtitle2">Tümünü göster</Typography>
      <InputSwitch checked={checked} onChange={handleChange} style={{ margin: 5, transform: "scale(0.8)" }} />
    </React.Fragment>
  );

  // Get Add appointment buttons
  const actionButton = () => (
    <React.Fragment>
      <Button
        label="Randevu Ekle"
        icon="pi pi-plus"
        className="p-button-text p-button-info mr-2"
        onClick={onClickAdd}
      />
    </React.Fragment>
  );

  return (
    <Toolbar className="mb-4 p-2" left={actionButton} right={inputSwitch} />
  );
}

export default CalendarToolbar;
