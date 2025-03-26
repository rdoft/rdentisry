import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { InputSwitch } from "primereact";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { SubscriptionController } from "components/Subscription";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";
import { useSubscription } from "context/SubscriptionProvider";

// services
import { UserService } from "services";

// ==============================|| AUTOMATION - APPOINTMENT REMINDER TAB ||============================== //

const AppointmentReminderTab = () => {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();
  const { isSubscribed, limits } = useSubscription();

  const [settings, setSettings] = useState({ appointmentReminder: false });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("AppointmentReminderTab");
    UserService.getUser({ signal })
      .then((res) => {
        const response = res.data;
        setSettings(response.userSetting);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("AppointmentReminderTab"));
    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // SERVICES ----------------------------------------------------------------
  // Save user settings
  const saveSettings = async (settings) => {
    startLoading("save");
    try {
      await UserService.saveSettings(settings);
      setSettings(settings);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS ------------------------------------------------------------------------------------------------
  // Handler for reminder settings
  const handleChangeReminder = (event) => {
    saveSettings({
      ...settings,
      appointmentReminder: event.value,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <List
        component="nav"
        sx={{
          p: 0,
          mb: 2,
          "& .MuiListItemIcon-root": {
            minWidth: 32,
            color: theme.palette.text.secondary,
          },
        }}
      >
        {/* SMS Reminder Toggle */}
        <ListItem
          sx={{
            bgcolor: theme.palette.background.secondary,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <ListItemIcon>
            <i
              className="fi fi-rr-calendar-clock"
              style={{
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></i>
          </ListItemIcon>
          <ListItemText
            primary="Randevu Hatırlatmayı Aktifleştir"
            secondary="SMS izni verilen hastalara otomatik hatırlatma mesajı gönderilir."
          />
          <div style={{ marginLeft: "10px" }}>
            <SubscriptionController type="sms" top={0} right={0}>
              <InputSwitch
                checked={
                  isSubscribed && limits.sms > 0 && settings.appointmentReminder
                }
                onChange={handleChangeReminder}
              />
            </SubscriptionController>
          </div>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
        Randevu Hatırlatma Döngüsü
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "center",
          flexWrap: { xs: "wrap", md: "nowrap" },
          "& > *": { mb: { xs: 1, md: 0 } },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            flex: 1,
          }}
        >
          <Chip
            label="Son 3 Gün"
            sx={{
              mb: 1,
              fontWeight: "bold",
              fontSize: "1rem",
              height: "auto",
              py: 0.5,
            }}
          />
          <Typography variant="body2">
            Onay bağlantısı içeren ilk hatırlatma
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            flex: 1,
          }}
        >
          <Chip
            label="Son 1 Gün"
            sx={{
              mb: 1,
              fontWeight: "bold",
              fontSize: "1rem",
              height: "auto",
              py: 0.5,
            }}
          />
          <Typography variant="body2">Son randevu hatırlatması</Typography>
        </Box>
      </Stack>

      <Box sx={{ ml: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • SMS hatırlatma, sadece <b>SMS izni</b> olan hastalara gönderilir. Bu
          izin, hasta listesinde "İzinler" bölümünden ayarlanabilir.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Randevu tarihinden <b>3 gün önce</b>, hastaya onay (doğrulama) linki
          içeren bir SMS hatırlatma mesajı gönderilir.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Randevu tarihinden <b>1 gün önce</b>, sadece randevu hatırlatma
          mesajı gönderilir. Bu mesaj, hasta tarafından reddedilmemiş ve durumu
          "Bekliyor" olan randevular için gönderilir.
        </Typography>
      </Box>
    </Box>
  );
};

export default AppointmentReminderTab;
