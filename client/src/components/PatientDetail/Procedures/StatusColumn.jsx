import React from "react";
import { Dropdown, Tag } from "primereact";

// assets
import "assets/styles/PatientDetail/StatusColumn.css";

function StatusColumn({ procedure, onSubmit }) {
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
  ];

  // Set status of the procedure
  const status = procedure.completedDate ? statusItems[1] : statusItems[0];

  // HANDLERS -----------------------------------------------------------------
  // onChangeStatus handler
  const handleChange = () => {
    onSubmit({
      ...procedure,
      completedDate: procedure.completedDate ? null : new Date(),
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
      className="statusColumn"
      style={{ backgroundColor: status.bgColor, color: status.color }}
    />
  );
}

export default StatusColumn;
