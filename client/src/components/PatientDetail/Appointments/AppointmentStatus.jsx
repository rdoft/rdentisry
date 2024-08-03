import React from "react";
import { Tag, Dropdown } from "primereact";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/PatientDetail/AppointmentStatus.css";

function AppointmentStatus({ appointment, onSubmit }) {
  const theme = useTheme();

  // Status items
  const statusItems = [
    {
      status: "active",
      label: "Bekleniyor",
      bgColor: theme.palette.background.info,
      color: theme.palette.text.info,
    },
    {
      status: "completed",
      label: "Tamamlandı",
      bgColor: theme.palette.background.success,
      color: theme.palette.text.success,
    },
    {
      status: "canceled",
      label: "İptal Edildi",
      bgColor: theme.palette.background.error,
      color: theme.palette.text.error,
    },
    {
      status: "absent",
      label: "Gelmedi",
      bgColor: theme.palette.background.warning,
      color: theme.palette.text.warning,
    },
  ];

  // Set status of the appointment
  const status = statusItems.find((item) => item.status === appointment.status);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler and set the status of the appointment
  const handleChange = (event) => {
    const { value } = event.target;
    onSubmit({
      ...appointment,
      status: value.status,
    });
  };

  // TEMPLATES -----------------------------------------------------------------
  // Status value template
  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option.label}
        style={{
          backgroundColor: option.bgColor,
          color: option.color,
          paddingY: 0,
        }}
      />
    );
  };

  return (
    <Dropdown
      value={status}
      options={statusItems}
      optionLabel="desc"
      valueTemplate={statusItemTemplate}
      itemTemplate={statusItemTemplate}
      onChange={handleChange}
      className="statusDropdown"
      style={{ backgroundColor: status.bgColor, color: status.color }}
    />
  );
}

export default AppointmentStatus;
