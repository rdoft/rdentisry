import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ResetPasswordDialog } from "components/Dialog";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";

// services
import { UserService } from "services";

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();

  const [passwordDialog, setPasswordDialog] = useState(false);

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

  // HANDLERS ------------------------------------------------------------------------------------------------
  // Show change password dialog
  const showPasswordDialog = () => {
    setPasswordDialog(true);
  };

  // Hide change password dialog
  const hidePasswordDialog = () => {
    setPasswordDialog(false);
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
            <i
              className="fi fi-rr-otp"
              style={{
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></i>
          </ListItemIcon>
          <ListItemText primary="Şifreyi Değiştir" />
        </ListItemButton>
      </List>

      {/* Change Password Dialog */}
      {passwordDialog && (
        <ResetPasswordDialog onSubmit={saveUser} onHide={hidePasswordDialog} />
      )}
    </>
  );
};

export default SettingTab;
