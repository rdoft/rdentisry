import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";
import { Menu, Divider } from "primereact";
import {
  Grid,
  Typography,
  Box,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import { Reminder, Basic, Delete } from "components/Button";
import { LoadingIcon, ReminderStatus } from "components/Other";
import { SubscriptionController } from "components/Subscription";

// assets
import "react-big-calendar/lib/css/react-big-calendar.css";

// services
import { ReminderService } from "services";

function MonthEvent({ initEvent = {}, onSubmit, onDelete }) {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { refresh } = useSubscription();

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
    event.preventDefault();
    event.stopPropagation();
    menu.current.toggle(event);
  };

  // onClick patient handler
  const handleClickPatient = () => {
    id && navigate(`/patients/${id}`);
  };

  // onClick send reminder handler
  const handleClickSendReminder = () => {
    e.id && sendReminder(e.id);
  };

  // onClick send approvement handler
  const handleClickSendApprovement = () => {
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

  // onDelete handler
  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(e);
  };

  // TEMPLATES -----------------------------------------------------------------
  // Action button (more)
  const actionButton = (
    <Menu
      model={[
        {
          template: () => (
            <Basic label="Görüntüle / Düzenle" icon="pi pi-external-link" />
          ),
        },
        {
          template: () => (
            <Basic
              label="Hastaya Git"
              icon="pi pi-arrow-circle-right"
              onClick={handleClickPatient}
            />
          ),
        },
        ...(showApprove
          ? [
              {
                template: () => (
                  <Basic
                    label="Onayla"
                    icon="pi pi-check"
                    severity="primary"
                    onClick={(event) =>
                      handleChangeReminderStatus(event, "approved")
                    }
                  />
                ),
              },
            ]
          : showRemoveApprove
          ? [
              {
                template: () => (
                  <Basic
                    label="Onayı Kaldır"
                    icon="pi pi-times"
                    onClick={(event) => handleChangeReminderStatus(event, null)}
                  />
                ),
              },
            ]
          : []),
        ...(onDelete
          ? [
              {
                template: () => (
                  <Delete
                    label="Sil"
                    onClick={(event) => handleDelete(event)}
                    style={{ width: "100%", textAlign: "start" }}
                  />
                ),
              },
            ]
          : []),
        ...(showSendReminder
          ? [
              {
                template: () => (
                  <>
                    <Divider type="solid" className="my-2" />
                    <SubscriptionController
                      type="sms"
                      style={{ width: "100%" }}
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%" }}
                      >
                        <Reminder
                          label="Hatırlatma Gönder"
                          icon="pi pi-bell"
                          disabled={!isSMS}
                          onClick={handleClickSendReminder}
                        />
                      </div>
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
                    <SubscriptionController
                      type="sms"
                      style={{ width: "100%" }}
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%" }}
                      >
                        <Reminder
                          label="Hasta Onayına Gönder"
                          icon="pi pi-send"
                          disabled={!isSMS}
                          onClick={handleClickSendApprovement}
                        />
                      </div>
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
      style={{ padding: "0.25rem" }}
    />
  );

  return e.temp ? (
    <LoadingIcon style={{ height: "100%", alignItems: "center" }} />
  ) : (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Tooltip title={`${startHours}-${endHours}`} placement="top" arrow>
        <Grid container position="relative" onContextMenu={handleRightClick}>
          <Grid container>
            <Grid item xs={12}>
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="caption" fontWeight="bold" noWrap>
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
          </Grid>
          {actionButton}
        </Grid>
      </Tooltip>
    </ClickAwayListener>
  );
}

export default MonthEvent;
