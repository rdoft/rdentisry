import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  Avatar,
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
import { InputSwitch } from "primereact";
import { Read } from "components/Button";

// project import
import { MainCard } from "components/cards";
import Transitions from "components/@extended/Transitions";
import NotificationItem from "./NotificationItem";

// services
import { NotificationService } from "services";

// assets
import notificationSvg from "assets/svg/profile/notification.svg";

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
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [checked, setChecked] = useState(
    localStorage.getItem("showAllNotification") === "true"
  );

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    NotificationService.getNotifications(!checked ? "sent" : null, { signal })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((error) => {});

    return () => {
      controller.abort();
    };
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

      // Set the notifications list
      getNotifications();
    } catch (error) {
      error.message && toast.error(error.message);
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

  // onChange handler for show only unread notifications
  const handleChecked = (event) => {
    localStorage.setItem("showAllNotification", event.value);
    setChecked(event.value);
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

  // Count of the sent notifications (unread)
  const getSentCount = () => {
    const sentNotifications = notifications.filter(
      (notification) => notification.status === "sent"
    );
    return sentNotifications.length;
  };

  return (
    <Box sx={{ flexShrink: 0, px: 1.5, mb: 1 }}>
      <IconButton
        disableRipple
        sx={{
          px: drawerOpen && 1,
          width: drawerOpen ? 1 : 36,
          justifyContent: drawerOpen && "flex-start",
          color: theme.palette.text.primary,
          bgcolor: open ? theme.palette.background.primary : null,
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge
          badgeContent={getSentCount() || null}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: theme.palette.text.secondary,
              color: "white",
            },
          }}
        >
          <Avatar
            alt="notification"
            src={notificationSvg}
            sx={{ width: 24, height: 24, padding: "1px" }}
          />
          {drawerOpen && (
            <Typography variant="h6" sx={{ px: "10px" }}>
              Bildirim
            </Typography>
          )}
        </Badge>
      </IconButton>

      <Popper
        placement={"right-start"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
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
        sx={{ zIndex: 1300 }}
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
                  sx={{ maxHeight: 600, overflowY: "auto" }}
                  secondary={
                    <Grid
                      container
                      mt={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Mark all as read */}
                      <Grid item xs="auto">
                        <Read onClick={handleClickRead} />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          Hepsini okundu olarak işaretle
                        </Typography>
                      </Grid>
                      {/* Show unread */}
                      <Grid container item xs={4} justifyContent="end">
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          Okunanları göster
                        </Typography>
                      </Grid>
                      <Grid container item xs="auto" justifyContent="end">
                        <InputSwitch
                          checked={checked}
                          onChange={handleChecked}
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
