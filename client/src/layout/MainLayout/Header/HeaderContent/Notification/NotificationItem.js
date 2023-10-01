import React from "react";
import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Grid,
} from "@mui/material";
import { Button } from "primereact";
import ActionGroup from "components/ActionGroup/ActionGroup";

// assets
import { LiraDangerIcon } from "assets/images/icons";
import { LiraWarningIcon } from "assets/images/icons";

function NotificationItem({ status, message, event, timestamp }) {
  timestamp = new Date(timestamp);
  const date = timestamp.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  let icon;
  switch (event) {
    case "overdue":
      icon = LiraDangerIcon;
      break;
    case "upcoming":
      icon = LiraWarningIcon;
    default:
      break;
  }

  // Action button for pay
  const readButton = (
    <Button
      text
      outlined
      size="sm"
      icon="pi pi-check-circle"
      severity="secondary"
    />
  );

  return (
    <ListItemButton
      sx={{
        margin: "0.2rem",
        borderRadius: "10px",
        bgcolor: status === "sent" ? "#EEF6FF" : "transparent",
        // color: status === "sent" ? "#3B81F6" : "",
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={icon}
          sx={{ width: "24px !important", height: "24px !important" }}
        ></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="subtitle">{message}</Typography>}
      />
      <ListItemSecondaryAction
        sx={{ alignSelf: "center !important", paddingLeft: "1rem" }}
      >
        <ListItemText
          primary={
            <Typography variant="caption" textAlign="end" noWrap>
              {date}
            </Typography>
          }
          secondary={status === "read" ? "Okundu" : ""}
        />
      </ListItemSecondaryAction>
      {status === "read" || (
        <ListItemSecondaryAction sx={{ alignSelf: "center !important" }}>
          <ActionGroup custom={readButton} />
        </ListItemSecondaryAction>
      )}
    </ListItemButton>
  );
}

export default NotificationItem;
