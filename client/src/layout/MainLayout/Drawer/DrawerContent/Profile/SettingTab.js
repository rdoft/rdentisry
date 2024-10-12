import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { InputSwitch } from "primereact";
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ResetPasswordDialog } from "components/Dialog";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";

// assets
import lockSvg from "assets/svg/profile/lock.svg";
import reminderSvg from "assets/svg/profile/reminder.svg";

// services
import { UserService } from "services";

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [settings, setSettings] = useState({ appointmentReminder: false });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("SettingTab");
    UserService.getUser({ signal })
      .then((res) => {
        const response = res.data;
        setSettings(response.userSetting);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("SettingTab"));
    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

  // SERVICES ----------------------------------------------------------------
  // Change password
  const saveUser = async (user) => {
    startLoading("save");
    try {
      await UserService.saveUser(user);
      setPasswordDialog(false);
      toast.success("Şifreniz başarıyla güncellendi");
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

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
  // Show change password dialog
  const showPasswordDialog = () => {
    setPasswordDialog(true);
  };

  // Hide change password dialog
  const hidePasswordDialog = () => {
    setPasswordDialog(false);
  };

  // Handler for reminder settings
  const handleChangeReminder = (event) => {
    saveSettings({
      ...settings,
      appointmentReminder: event.value,
    });
  };

  return (
    <>
      <List
        component="nav"
        sx={{
          p: 0,
          "& .MuiListItemIcon-root": {
            minWidth: 32,
            color: theme.palette.text.secondary,
          },
        }}
      >
        {/* Change Password */}
        <ListItemButton
          onClick={showPasswordDialog}
          sx={{
            "&:hover": {
              bgcolor: theme.palette.background.secondary,
            },
            "&.Mui-selected": {
              bgcolor: theme.palette.background.secondary,
              borderRight: `2px solid ${theme.palette.text.secondary}`,
              borderLeft: `2px solid ${theme.palette.text.secondary}`,
              borderRadius: "10px",
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.text.secondary,
                bgcolor: theme.palette.background.secondary,
              },
            },
          }}
        >
          <ListItemIcon>
            <Avatar src={lockSvg} sx={{ width: 16, height: 16 }} />
          </ListItemIcon>
          <ListItemText primary="Şifreyi Değiştir" />
        </ListItemButton>

        {/* Reminder preferece */}
        <ListItem>
          <ListItemIcon>
            <Avatar src={reminderSvg} sx={{ width: 16, height: 16 }} />
          </ListItemIcon>
          <ListItemText
            primary="Otomatik Hatırlatma"
            secondary="SMS izni verdiğiniz hastalara otomatik randevu hatırlatma mesajı gönderilir."
          />
          <div style={{ marginLeft: "10px" }}>
            <InputSwitch
              checked={settings.appointmentReminder}
              onChange={handleChangeReminder}
            />
          </div>
        </ListItem>
      </List>

      {/* Change Password Dialog */}
      {passwordDialog && (
        <ResetPasswordDialog onSubmit={saveUser} onHide={hidePasswordDialog} />
      )}
    </>
  );
};

export default SettingTab;
