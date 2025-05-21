import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getTabIndex } from "utils";
import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Read } from "components/Button";
import { useTheme } from "@mui/material/styles";

// icons
import {
  WarningAmberRoundedIcon,
  ErrorRoundedIcon,
  InfoRoundedIcon,
  StarRoundedIcon,
} from "assets/images/icons";

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

  // Notification icons and colors
  const getIconConfig = () => {
    switch (notification.notificationEvent.event) {
      case "overdue":
        return {
          icon: <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />,
          color: theme.palette.warning.main,
        };
      case "dept":
        return {
          icon: <ErrorRoundedIcon sx={{ fontSize: 16 }} />,
          color: theme.palette.error.main,
        };
      case "upcoming":
        return {
          icon: <InfoRoundedIcon sx={{ fontSize: 16 }} />,
          color: theme.palette.info.main,
        };
      case "bonus":
        return {
          icon: <StarRoundedIcon sx={{ fontSize: 16 }} />,
          color: theme.palette.success.main,
        };
      default:
        return {
          icon: <InfoRoundedIcon sx={{ fontSize: 16 }} />,
          color: theme.palette.primary.main,
        };
    }
  };

  const { icon, color } = getIconConfig();

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
        mx: 0,
        my: "0.2rem",
        borderRadius: "10px",
        bgcolor:
          notification.status === "sent"
            ? theme.palette.background.secondary
            : "transparent",
        "&:hover": {
          bgcolor: theme.palette.action.hover,
        },
        px: 1.5,
      }}
      onClick={handleClickNotification}
    >
      <ListItemAvatar
        sx={{
          minWidth: 28,
          mr: 1,
        }}
      >
        <Avatar
          sx={{
            width: 20,
            height: 20,
            bgcolor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="body2"
            sx={{
              fontSize: "13px",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {notification.message}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "11px" }}
          >
            {date}
          </Typography>
        }
      />
      {notification.status === "read" ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            ml: 1,
            fontSize: "11px",
          }}
        >
          Okundu
        </Typography>
      ) : (
        <Read onClick={handleClickRead} size="small" />
      )}
    </ListItemButton>
  );
}

export default NotificationItem;
