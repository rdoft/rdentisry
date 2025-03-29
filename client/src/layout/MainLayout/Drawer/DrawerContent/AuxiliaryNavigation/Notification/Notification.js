import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  Badge,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// project import
import { NotificationDialog } from "components/Dialog";
import NotificationItem from "./NotificationItem";

// services
import { NotificationService } from "services";

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const theme = useTheme();
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Initialize notification count on component mount
  useEffect(() => {
    // Get only unread notifications count
    const fetchInitialCount = async () => {
      try {
        const response = await NotificationService.getNotifications("sent");
        if (response.data) {
          setNotificationCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchInitialCount();
  }, []);

  // HANDLERS -----------------------------------------------------------------
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handler for updating notification count
  const handleCountChange = (count) => {
    setNotificationCount(count);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? 3 : 1.5,
          py: !drawerOpen ? 1.25 : 1,
          ...(drawerOpen && {
            "&:hover": {
              bgcolor: theme.palette.background.secondary,
              borderRadius: "10px",
            },
          }),
          ...(!drawerOpen && {
            "&:hover": {
              bgcolor: "transparent",
            },
          }),
          ...(open && {
            bgcolor: theme.palette.background.secondary,
            ...(drawerOpen && {
              borderRadius: "10px",
            }),
            color: theme.palette.text.secondary,
          }),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: open
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                bgcolor: "secondary.lighter",
              },
            }),
          }}
        >
          <Badge
            badgeContent={notificationCount || null}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: theme.palette.text.secondary,
                color: "white",
                fontSize: "10px",
                minWidth: "16px",
                height: "16px",
              },
            }}
          >
            <i
              className="fi fi-rr-bell-notification-social-media"
              style={{
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></i>
          </Badge>
        </ListItemIcon>

        {drawerOpen && (
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{
                  color: open
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                  paddingLeft: "10px",
                }}
              >
                Bildirim
              </Typography>
            }
          />
        )}
      </ListItemButton>

      {/* Using the separate NotificationDialog component */}
      <NotificationDialog
        open={open}
        onClose={handleClose}
        NotificationItem={NotificationItem}
        onCountChange={handleCountChange}
      />
    </>
  );
};

export default Notification;
