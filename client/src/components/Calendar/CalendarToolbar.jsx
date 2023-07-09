import React from "react";
import { Toolbar, Button } from "primereact";

function CalendarToolbar({ onClickAdd }) {
  // Get Add appointment buttons
  const getActionButton = () => {
    return (
      <React.Fragment>
        <Button
          label="Randevu Ekle"
          icon="pi pi-plus"
          className="p-button-text p-button-info mr-2"
          onClick={onClickAdd}
        />
      </React.Fragment>
    );
  };

  return <Toolbar className="mb-4 p-2" left={getActionButton} />;
}

export default CalendarToolbar;
