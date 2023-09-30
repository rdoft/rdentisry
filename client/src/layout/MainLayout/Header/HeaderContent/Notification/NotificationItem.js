import React from "react";
import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Stack,
} from "@mui/material";

// assets
import { LiraDangerIcon } from "assets/images/icons";
import { LiraWarningIcon } from "assets/images/icons";

// TODO:
// USER has OVERDUE PAYMENT
// USER has UPCOMING PAYMENT
// event -> user-status(overdue, upcomming)-type(payment)

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

  return (
    <ListItemButton>
      <ListItemAvatar>
        <Avatar
          src={icon}
          sx={{ width: "24px !important", height: "24px !important" }}
        ></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="subtitle">{message}</Typography>}
        // secondary="7 hours ago"
      />
      <ListItemSecondaryAction>
        <Stack>
          {/* <Typography variant="caption" textAlign="end" noWrap>
            {time}
          </Typography> */}
          <Typography variant="caption" textAlign="end" noWrap>
            {date}
          </Typography>
        </Stack>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}

export default NotificationItem;
