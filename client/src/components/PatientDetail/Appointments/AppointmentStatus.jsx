import React from "react";
import { Tag, Dropdown } from "primereact";

// assets
import "assets/styles/PatientDetail/AppointmentStatus.css";

function AppointmentStatus({ appointment, onSubmit }) {
  // Status items
  const statusItems = [
    {
      status: "active",
      label: "Bekleniyor",
      bgColor: "#E8F0FF",
      color: "#1E7AFC",
    },
    {
      status: "completed",
      label: "Tamamlandı",
      bgColor: "#DFFCF0",
      color: "#22A069",
    },
    {
      status: "canceled",
      label: "İptal Edildi",
      bgColor: "#FFD2CB",
      color: "#EF4444",
    },
    {
      status: "absent",
      label: "Gelmedi",
      bgColor: "#FFFADD",
      color: "#FFD200",
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
