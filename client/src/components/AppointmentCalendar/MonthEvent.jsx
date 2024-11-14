import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoading } from "context/LoadingProvider";
import { activeItem } from "store/reducers/menu";
import { Menu, Divider } from "primereact";
import {
  Grid,
  Typography,
  Box,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import { More, Reminder } from "components/Button";
import { LoadingIcon, ReminderStatus } from "components/Other";
import { SubscriptionController } from "components/Subscription";

// assets
import { useTheme } from "@mui/material/styles";
import "react-big-calendar/lib/css/react-big-calendar.css";

// services
import { ReminderService } from "services";

function MonthEvent({ initEvent = {}, onSubmit }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startLoading, stopLoading } = useLoading();

  const menu = useRef(null);
  const [e, setEvent] = useState({
    id: null,
    status: null,
    reminderStatus: null,
    ...initEvent,
  });

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
        setEvent({ ...e, reminderStatus });
        toast.success("Onay mesajı başarıyla gönderildi");
      } else {
        toast.success("Hatırlatma mesajı başarıyla gönderildi");
      }
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("send");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // onClick handler
  const handleRightClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
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
          width: "1.4rem",
          height: "1.2rem",
          padding: "0.25rem 0.5rem",
          color: theme.palette.text.event,
        }}
        onClick={(event) => {
          event.stopPropagation();
          menu.current.toggle(event);
        }}
      />
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
                    handleChangeReminderStatus(event.originalEvent, "approved"),
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
        style={{ padding: "0.5rem" }}
      />
    </>
  );

  return e.temp ? (
    <LoadingIcon style={{ height: "100%", alignItems: "center" }} />
  ) : (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Tooltip title={`${startHours}-${endHours}`} placement="top" arrow>
        <Grid container position="relative" onContextMenu={handleRightClick}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="end"
            position="absolute"
            top={3}
            right={3}
          >
            {actionButton}
          </Box>

          <Grid container>
            <Grid item xs={10}>
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="space-between"
                style={{
                  border: `0.5px solid ${theme.palette.text.eventBorder} `,
                  borderRadius: "5px",
                  padding: "0.1rem 0.2rem",
                }}
              >
                <Typography variant="h6" fontWeight="bolder" noWrap>
                  {`${pname} ${psurname}`}
                </Typography>

                {e.status === "active" && (
                  <ReminderStatus status={e.reminderStatus} />
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Tooltip>
    </ClickAwayListener>
  );
}

export default MonthEvent;
