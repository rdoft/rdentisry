import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ProfileDialog } from "components/Dialog";
import { useTheme } from "@mui/material/styles";
import { useLoading } from "context/LoadingProvider";

// assets
import editSvg from "assets/svg/profile/edit.svg";

// services
import { UserService } from "services";

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ name, setName }) => {
  const theme = useTheme();
  const { startLoading, stopLoading } = useLoading();

  const [profileDialog, setProfileDialog] = useState(false);

  // SERVICES -----------------------------------------------------------------
  // Save user
  const saveUser = async (user) => {
    startLoading("save");
    try {
      await UserService.saveUser(user);
      setProfileDialog(false);
      setName(user.name);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // HANDLERS -----------------------------------------------------------------
  // Show edit profile dialog
  const showProfileDialog = () => {
    setProfileDialog(true);
  };

  // Hide add profile dialog
  const hideProfileDialog = () => {
    setProfileDialog(false);
  };

  return (
    <>
      <List
        component="nav"
        sx={{
          p: 0,
          "& .MuiListItemIcon-root": {
            minWidth: 32,
            color: theme.palette.grey[500],
          },
        }}
      >
        <ListItemButton
          onClick={showProfileDialog}
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
            <Avatar src={editSvg} sx={{ width: 16, height: 16 }} />
          </ListItemIcon>
          <ListItemText primary="Adı Güncelle" />
        </ListItemButton>
      </List>

      {/* Profile Dialog */}
      {profileDialog && (
        <ProfileDialog
          initProfile={{ name }}
          onSubmit={saveUser}
          onHide={hideProfileDialog}
        />
      )}
    </>
  );
};
export default ProfileTab;
