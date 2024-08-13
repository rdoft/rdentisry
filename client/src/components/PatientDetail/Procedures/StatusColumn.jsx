import React, { useState } from "react";
import { Dropdown, Tag } from "primereact";
import { LoadingIcon } from "components/Other";

// assets
import { useTheme } from "@mui/material/styles";
import "assets/styles/PatientDetail/StatusColumn.css";

function StatusColumn({ procedure, onSubmit }) {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

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
  ];

  // Set status of the procedure
  const status = procedure.completedDate ? statusItems[1] : statusItems[0];

  // HANDLERS -----------------------------------------------------------------
  // onChangeStatus handler
  const handleChange = async () => {
    setLoading(true);
    await onSubmit({
      ...procedure,
      completedDate: procedure.completedDate ? null : new Date(),
    });
    setLoading(false);
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

  return loading ? (
    <LoadingIcon />
  ) : (
    <Dropdown
      value={status}
      options={statusItems}
      optionLabel="desc"
      valueTemplate={statusItemTemplate}
      itemTemplate={statusItemTemplate}
      onChange={handleChange}
      disabled={!procedure.visit.approvedDate}
      dropdownIcon={!procedure.visit.approvedDate ? "pi pi-ban" : ""}
      className="status-column"
      style={{ backgroundColor: status.bgColor, color: status.color }}
    />
  );
}

export default StatusColumn;
