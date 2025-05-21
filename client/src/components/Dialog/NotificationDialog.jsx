import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  List,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InputSwitch } from "primereact";
import { Read } from "components/Button";

// services
import { NotificationService } from "services";

// NotificationItem is passed in as a prop to avoid circular dependencies
function NotificationDialog({
  open,
  onClose,
  NotificationItem,
  onCountChange,
}) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [notifications, setNotifications] = useState([]);
  const [sentCount, setSentCount] = useState(0);
  const [checked, setChecked] = useState(
    localStorage.getItem("showAllNotification") === "true"
  );

  // sx styles for notification items
  const actionSX = {
    mt: "6px",
    ml: 1,
    top: "auto",
    right: "auto",
    alignSelf: "flex-start",
    transform: "none",
  };

  // Helper function to calculate and update sent count
  // Wrapped in useCallback to prevent recreation on each render
  const updateSentCount = useCallback(
    (data) => {
      const count = data.filter(
        (notification) => notification.status === "sent"
      ).length;

      setSentCount(count);

      // Also notify parent component
      if (onCountChange) {
        onCountChange(count);
      }
    },
    [onCountChange]
  );

  // Fetch notifications on component mount and when checked changes
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const signal = controller.signal;

    NotificationService.getNotifications(!checked ? "sent" : null, { signal })
      .then((res) => {
        setNotifications(res.data);
        updateSentCount(res.data);
      })
      .catch((error) => {});

    return () => {
      controller.abort();
    };
  }, [checked, open, updateSentCount]);

  // Get the list of notifications
  const getNotifications = async () => {
    try {
      const response = checked
        ? await NotificationService.getNotifications()
        : await NotificationService.getNotifications("sent");

      setNotifications(response.data);
      updateSentCount(response.data);
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Update all notifications statuses
  const updateNotifications = async (status) => {
    const statuses = ["read", "sent", "dismissed"];

    try {
      if (statuses.includes(status)) {
        await NotificationService.updateNotifications(status);
      }

      // Refresh notifications
      getNotifications();
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  // Mark all as read handler
  const handleClickRead = () => {
    updateNotifications("read");
  };

  // Show read notifications toggle handler
  const handleChecked = (event) => {
    localStorage.setItem("showAllNotification", event.value);
    setChecked(event.value);
  };

  // Notification list component
  const notificationList = (
    <List
      component="nav"
      sx={{
        p: 0,
        "& .MuiListItemButton-root": {
          py: 0.5,
          "& .MuiAvatar-root": {
            width: 20,
            height: 20,
            fontSize: "0.75rem",
          },
          "& .MuiListItemSecondaryAction-root": {
            ...actionSX,
            position: "relative",
          },
        },
      }}
    >
      {notifications.length ? (
        notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <NotificationItem
              notification={notification}
              getNotifications={getNotifications}
              onClose={onClose}
            />
          </React.Fragment>
        ))
      ) : (
        <Typography variant="h6" textAlign="center" m={2}>
          Hiçbir bildirim yoktur
        </Typography>
      )}
    </List>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
      sx={{
        zIndex: theme.zIndex.dialog || 1400,
      }}
    >
      <DialogTitle
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          Bildirimler
          {sentCount > 0 && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                ml: 1,
                px: 1,
                py: 0.25,
                bgcolor: theme.palette.text.secondary,
                color: "white",
                borderRadius: 5,
              }}
            >
              {sentCount}
            </Typography>
          )}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          <i
            className="fi fi-rr-cross-small"
            style={{
              fontSize: "16px",
            }}
          ></i>
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          width: "100%",
          px: matchDownSM ? 1 : 2,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Read onClick={handleClickRead} size="small" />
            <Typography
              variant="caption"
              color="text.primary"
              sx={{ whiteSpace: "wrap" }}
            >
              Hepsini okundu olarak işaretle
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <InputSwitch
              checked={checked}
              onChange={handleChecked}
              style={{
                transform: "scale(0.6)",
                margin: 0,
              }}
            />
            <Typography
              variant="caption"
              color="text.primary"
              sx={{ whiteSpace: "wrap" }}
            >
              Okunanları göster
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          "&:first-of-type": {
            pt: 0,
          },
          maxHeight: matchDownSM ? "calc(80vh - 140px)" : "520px",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            py: 1,
            px: matchDownSM ? 1 : 2,
          }}
        >
          {notificationList}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationDialog;
