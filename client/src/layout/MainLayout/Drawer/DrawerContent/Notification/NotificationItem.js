import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getTabIndex } from "utils";
import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";
import { Read } from "components/Button";

// assets
import {
  LiraDangerIcon,
  LiraWarningIcon,
  LiraInfoIcon,
  BonusIcon,
} from "assets/images/icons";
import { useTheme } from "@mui/material/styles";

// services
import { NotificationService } from "services";

function NotificationItem({ notification, getNotifications, onClose }) {
  const theme = useTheme();
  const navigate = useNavigate();

  // Date of the notificaiton
  const date = new Date(notification.timestamp).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  // Notification icons
  let icon;
  switch (notification.notificationEvent.event) {
    case "overdue":
      icon = LiraWarningIcon;
      break;
    case "upcoming":
      icon = LiraInfoIcon;
      break;
    case "dept":
      icon = LiraDangerIcon;
      break;
    case "bonus":
      icon = BonusIcon;
      break;
    default:
      break;
  }

  // SERVICES -----------------------------------------------------------------
  // Update the notification
  const updateNotification = async (status) => {
    const statuses = ["read", "sent", "dismissed"];

    try {
      if (statuses.includes(status)) {
        await NotificationService.updateNotification({
          ...notification,
          status,
        });
      }

      // Set the notifications list
      getNotifications();
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onClick handler to go to the patient page
  const handleClickNotification = () => {
    onClose();
    if (notification.notificationEvent.type === "referral") {
      navigate("/pricing");
    } else if (notification.notificationEvent.type === "payment") {
      localStorage.setItem("activeTabIndex", getTabIndex("payments"));
      navigate(`/patients/${notification.patient.id}`);
    }
    updateNotification("read");
  };

  // onClick handler for mark notification as read
  const handleClickRead = (event) => {
    event.stopPropagation();
    updateNotification("read");
  };

  return (
    <ListItemButton
      sx={{
        margin: "0.2rem",
        borderRadius: "10px",
        bgcolor:
          notification.status === "sent"
            ? theme.palette.background.secondary
            : "transparent",
      }}
      onClick={handleClickNotification}
    >
      <ListItemAvatar>
        <Avatar
          src={icon}
          sx={{ width: "30px !important", height: "30px !important" }}
        ></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle">{notification.message}</Typography>
        }
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
          secondary={notification.status === "read" ? "Okundu" : ""}
        />
      </ListItemSecondaryAction>
      {notification.status === "read" || (
        <ListItemSecondaryAction sx={{ alignSelf: "center !important" }}>
          <Read onClick={handleClickRead} style={{ zIndex: 100 }} />
        </ListItemSecondaryAction>
      )}
    </ListItemButton>
  );
}

export default NotificationItem;
