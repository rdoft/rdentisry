import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { toastErrorMessage } from "components/errorMesage";
import { useTheme } from "@mui/material/styles";
import {
  Badge,
  Box,
  ClickAwayListener,
  IconButton,
  List,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
  Grid,
  Divider,
} from "@mui/material";
import { Button, InputSwitch } from "primereact";
import ActionGroup from "components/ActionGroup/ActionGroup";

// project import
import MainCard from "components/MainCard";
import Transitions from "components/@extended/Transitions";
import NotificationItem from "./NotificationItem";

// services
import { NotificationService } from "services";

// assets
import { BellOutlined } from "@ant-design/icons";

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const actionSX = {
  mt: "6px",
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Set the page on loading
  useEffect(() => {
    getNotifications();
  }, [checked]);

  // SERVICES -----------------------------------------------------------------
  // Get the list of notifications and set notifications value
  const getNotifications = async () => {
    let response;
    let notifications;

    try {
      if (checked) {
        response = await NotificationService.getNotifications();
      } else {
        response = await NotificationService.getNotifications("sent");
      }

      notifications = response.data;
      setNotifications(notifications);
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // Update all notifications statuses
  const updateNotifications = async (status) => {
    const statuses = ["read", "sent", "dismissed"];

    try {
      if (statuses.includes(status)) {
        await NotificationService.updateNotifications(status);
      }

      // Set the notifications list
      getNotifications();
    } catch (error) {
      toast.error(toastErrorMessage(error));
    }
  };

  // HANDLERS -----------------------------------------------------------------
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }
    setOpen(false);
  };

  // onClick handler for mark all notifications as read
  const handleClickRead = () => {
    updateNotifications("read");
  };

  // TEMPLATES ----------------------------------------------------------------
  const notificationList = (
    <List
      component="nav"
      sx={{
        p: 0,
        "& .MuiListItemButton-root": {
          py: 0.5,
          "& .MuiAvatar-root": avatarSX,
          "& .MuiListItemSecondaryAction-root": {
            ...actionSX,
            position: "relative",
          },
        },
      }}
    >
      {notifications.length ? (
        notifications.map((notification) => {
          return (
            <React.Fragment key={notification.id}>
              <NotificationItem
                notification={notification}
                getNotifications={getNotifications}
                onClose={handleClose}
              />
              {/* <Divider /> */}
            </React.Fragment>
          );
        })
      ) : (
        <Typography variant="h6" textAlign="center" m={2}>
          Hiçbir bildirim yoktur
        </Typography>
      )}
    </List>
  );

  // Action button for mark all as read
  const readButton = (
    <Button
      text
      outlined
      size="sm"
      icon="pi pi-check-circle"
      severity="secondary"
      style={{ width: "2rem", padding: "0.4rem" }}
      onClick={handleClickRead}
    />
  );

  // Count of the sent notifications (unread)
  const getSentCount = () => {
    const sentNotifications = notifications.filter(
      (notification) => notification.status === "sent"
    );
    return sentNotifications.length;
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{
          color: "text.primary",
          bgcolor: open ? "grey.300" : null,
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={getSentCount() || null} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>

      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [matchesXs ? -5 : 0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: 500,
                maxWidth: 500,
                [theme.breakpoints.down("md")]: {
                  maxWidth: 300,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Bildirimler"
                  elevation={0}
                  border={false}
                  content={false}
                  sx={{ maxHeight: 750, overflowY: "auto" }}
                  secondary={
                    <Grid
                      container
                      mt={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Mark all as read */}
                      <Grid item xs="auto">
                        <ActionGroup custom={readButton} />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="caption">
                          Hepsini okundu olarak işaretle
                        </Typography>
                      </Grid>
                      {/* Show unread */}
                      <Grid container item xs={4} justifyContent="end">
                        <Typography variant="caption">
                          Okunanları göster
                        </Typography>
                      </Grid>
                      <Grid container item xs="auto" justifyContent="end">
                        <InputSwitch
                          checked={checked}
                          onChange={(e) => setChecked(e.value)}
                          style={{ transform: "scale(0.6)" }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    </Grid>
                  }
                >
                  {notificationList}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;