import React from "react";
import { Tooltip } from "@mui/material";

// assets
import { useTheme } from "@mui/material/styles";

function ReminderStatus({ status, ...props }) {
  const theme = useTheme();

  // Status items
  const statusItems = [
    {
      status: "approved",
      icon: "pi pi-check",
      label: "Onaylandı",
    },
    {
      status: "rejected",
      icon: "pi pi-times",
      label: "Reddedildi",
    },
    {
      status: "sent",
      icon: "pi pi-hourglass",
      label: "Cevap Bekliyor",
    },
    {
      status: "updated",
      icon: "pi pi-sync",
      label: "Güncelleme Talebi",
    },
  ];

  // Set status of the reminder
  const reminderStatus = statusItems.find((item) => item.status === status);

  return (
    reminderStatus && (
      <Tooltip title={reminderStatus.label} placement="bottom" arrow>
        <div>
          <i
            className={reminderStatus.icon}
            style={{
              backgroundColor: theme.palette.text.event,
              color: theme.palette.common.white,
              fontWeight: "bold",
              fontSize: "0.7rem",
              padding: "0.25rem",
              borderRadius: "1rem",
              ...props.style,
            }}
          ></i>
        </div>
      </Tooltip>
    )
  );
}

export default ReminderStatus;