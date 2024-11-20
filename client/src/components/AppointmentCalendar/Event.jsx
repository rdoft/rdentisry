import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activeItem } from "store/reducers/menu";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { Menu, Divider } from "primereact";
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import { More, Reminder } from "components/Button";
import { LoadingIcon, ReminderStatus } from "components/Other";
import { SubscriptionController } from "components/Subscription";

// assets
import { doctorAvatar } from "assets/images/avatars";
import { useTheme } from "@mui/material/styles";
import "react-big-calendar/lib/css/react-big-calendar.css";

// services
import { ReminderService } from "services";

function Event({ initEvent = {}, step, onSubmit }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startLoading, stopLoading } = useLoading();
  const { refresh } = useSubscription();

  const menu = useRef(null);
  const [e, setEvent] = useState({
    id: null,
    status: null,
    reminderStatus: null,
    ...initEvent,
  });

  const { name: dname = "", surname: dsurname = "" } = e.doctor || {};
  const {
    id = null,
    isSMS = false,
    name: pname = "",
    surname: psurname = "",
  } = e.patient || {};

  const startHours = e.start.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHours = e.end.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const lg = e.duration > step * 1.2;
  const sm = e.duration < step;
  // Set conditions for sending reminder and approval
  const showSendReminder =
    e.status === "active" && e.reminderStatus === "approved";
  const showSendApprove =
    e.status === "active" && (!e.reminderStatus || e.reminderStatus === "sent");
  const showRemoveApprove =
    e.status === "active" && e.reminderStatus === "approved";
  const showApprove = e.status === "active" && e.reminderStatus !== "approved";

  // SERVICES -----------------------------------------------------------------
  // Send appointment reminder
  const sendReminder = async (id, reminderStatus) => {
    try {
      startLoading("send");
      await ReminderService.remindAppointment(id);
      if (reminderStatus) {
        setEvent({ ...e, reminderStatus, sms: { error: null } });
        toast.success("Onay mesajı talebi alındı");
      } else {
        toast.success("Hatırlatma mesajı talebi alındı");
        setEvent({ ...e, sms: { error: null } });
      }
      refresh();
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("send");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onClick handler
  const handleRightClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    menu.current.toggle(event);
  };

  // onClick patient handler
  const handleClickPatient = () => {
    id && navigate(`/patients/${id}`);
    dispatch(activeItem({ openItem: ["patients"] }));
  };

  // onClick send reminder handler
  const handleClickSendReminder = (event) => {
    event.stopPropagation();
    e.id && sendReminder(e.id);
  };

  // onClick send approvement handler
  const handleClickSendApprovement = (event) => {
    event.stopPropagation();
    e.id && sendReminder(e.id, "sent");
  };

  // onChangeReminderStatus handler
  const handleChangeReminderStatus = (event, reminderStatus) => {
    event.stopPropagation();
    setEvent({ ...e, reminderStatus });
    onSubmit({ ...e, reminderStatus });
  };

  // onClickAway handler
  const handleClickAway = () => {
    menu.current.hide();
  };

  // TEMPLATES -----------------------------------------------------------------
  // Action button (more)
  const actionButton = (
    <>
      <More
        style={{
          width: "1.8rem",
          height: "1.4rem",
          padding: 0,
          color: theme.palette.text.event,
        }}
        onClick={(event) => {
          event.stopPropagation();
          menu.current.toggle(event);
        }}
      />
      <ClickAwayListener onClickAway={handleClickAway}>
        <Menu
          model={[
            {
              label: "Görüntüle / Düzenle",
              icon: "pi pi-external-link",
              style: { fontSize: "0.8rem" },
            },
            {
              label: "Hastaya Git",
              icon: "pi pi-arrow-circle-right",
              style: { fontSize: "0.8rem" },
              command: handleClickPatient,
            },
            ...(showApprove
              ? [
                  {
                    label: "Onayla",
                    icon: "pi pi-check",
                    style: { fontSize: "0.8rem" },
                    command: (event) =>
                      handleChangeReminderStatus(
                        event.originalEvent,
                        "approved"
                      ),
                  },
                ]
              : showRemoveApprove
              ? [
                  {
                    label: "Onayı Kaldır",
                    icon: "pi pi-times",
                    style: { fontSize: "0.8rem" },
                    command: (event) =>
                      handleChangeReminderStatus(event.originalEvent, null),
                  },
                ]
              : []),
            ...(showSendReminder
              ? [
                  {
                    template: () => (
                      <>
                        <Divider type="solid" className="my-2" />
                        <SubscriptionController type="sms">
                          <Reminder
                            label="Hatırlatma Gönder"
                            icon="pi pi-bell"
                            disabled={!isSMS}
                            style={{ width: "100%" }}
                            onClick={handleClickSendReminder}
                          />
                        </SubscriptionController>
                      </>
                    ),
                  },
                ]
              : []),
            ...(showSendApprove
              ? [
                  {
                    template: () => (
                      <>
                        <Divider type="solid" className="my-2" />
                        <SubscriptionController type="sms">
                          <Reminder
                            label="Hasta Onayına Gönder"
                            icon="pi pi-send"
                            disabled={!isSMS}
                            style={{ width: "100%" }}
                            onClick={handleClickSendApprovement}
                          />
                        </SubscriptionController>
                      </>
                    ),
                  },
                ]
              : []),
          ]}
          ref={menu}
          id="popup_menu"
          popup
          popupAlignment="right"
          style={{ padding: "0.5rem" }}
        />
      </ClickAwayListener>
    </>
  );

  return e.temp ? (
    <LoadingIcon style={{ height: "100%", alignItems: "center" }} />
  ) : (
    <Tooltip title={sm && `${startHours}-${endHours}`} placement="top" arrow>
      <Grid
        container
        position="relative"
        onContextMenu={handleRightClick}
        alignItems="start"
        sx={{ height: "100%" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="end"
          position="absolute"
          top={0}
          right={0}
        >
          {actionButton}
        </Box>

        <Grid container>
          {/* Time */}
          {!sm && (
            <Grid item xs={12}>
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="caption" fontWeight="bold">
                  {`${startHours}-${endHours}`}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Patient  - ReminderStatus */}
          <Grid item xs={sm ? 10 : 12}>
            <Box
              display="flex"
              gap={1}
              alignItems="center"
              justifyContent="space-between"
              style={{
                border: `0.5px solid ${theme.palette.text.eventBorder} `,
                borderRadius: "5px",
                padding: "0.2rem 0.5rem",
                margin: sm ? "-0.3rem" : "0.4rem 0",
              }}
            >
              <Typography variant="h6" fontWeight="bolder" noWrap>
                {`${pname} ${psurname}`}
              </Typography>

              {e.status === "active" && (
                <ReminderStatus
                  status={e.reminderStatus}
                  errorMessage={e.sms?.error}
                />
              )}
            </Box>
          </Grid>

          {/* Doctor */}
          {lg && dname && (
            <Grid item xs={12}>
              <Box display="flex" gap={1} alignItems="start">
                <Avatar
                  alt="avatar"
                  src={doctorAvatar}
                  shape="circle"
                  style={{ width: "18px", height: "18px", padding: "1px" }}
                />
                <Typography variant="caption" noWrap>
                  {`Dt. ${dname} ${dsurname}`}
                </Typography>
              </Box>
            </Grid>
          )}

          {lg && e.description && (
            <Grid item xs={12}>
              <Box display="flex" gap={1} alignItems="start">
                <Typography variant="h6">🖋</Typography>
                <Typography variant="caption">
                  {e.description.includes("\n") ||
                  e.description.split(/\n/)[0].length > 24
                    ? e.description.split(/\n/)[0].slice(0, 24) + " ..."
                    : e.description.split(/\n/)[0]}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Tooltip>
  );
}

export default Event;
