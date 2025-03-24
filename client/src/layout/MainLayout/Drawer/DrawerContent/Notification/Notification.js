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
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
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
        notifications.map((notification) => {
          return (
            <React.Fragment key={notification.id}>
              <NotificationItem
                notification={notification}
                getNotifications={getNotifications}
                onClose={handleClose}
              />
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
          color: open
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
          bgcolor: open ? theme.palette.background.secondary : null,
          "&:hover": { bgcolor: theme.palette.background.secondary },
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
              fontSize: "10px",
              minWidth: "16px",
              height: "16px",
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
        placement={matchDownSM ? "top" : "right-start"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal={matchDownSM}
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, matchDownSM ? 0 : 9],
              },
            },
          ],
        }}
        sx={{
          zIndex: theme.zIndex.modal,
          width: matchDownSM ? "100%" : "auto",
          ...(matchDownSM && {
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            px: 1,
            pb: 2,
          }),
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: matchDownSM ? "100%" : 400,
                maxWidth: matchDownSM ? "100%" : 400,
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                ...(matchDownSM && {
                  borderRadius: "16px 16px 0 0",
                  py: 1.5,
                }),
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Bildirimler"
                  elevation={0}
                  border={false}
                  content={false}
                  sx={{
                    maxHeight: matchDownSM ? "calc(80vh - 100px)" : 600,
                    overflowY: "auto",
                    bgcolor: "transparent",
                    borderRadius: "inherit",
                    "& .MuiCardHeader-root": {
                      p: matchDownSM ? "12px 16px" : 2,
                    },
                    "& .MuiCardHeader-content": {
                      overflow: "hidden",
                    },
                  }}
                  secondary={
                    <Box
                      sx={{
                        width: "100%",
                        px: matchDownSM ? 1 : 2,
                        pt: 1,
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
                          <Read
                            onClick={handleClickRead}
                            size="small"
                            sx={{
                              minWidth: "unset",
                              p: "4px",
                            }}
                          />
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
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  }
                >
                  <Box
                    sx={{
                      px: 0,
                      py: 1,
                    }}
                  >
                    {notificationList}
                  </Box>
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
