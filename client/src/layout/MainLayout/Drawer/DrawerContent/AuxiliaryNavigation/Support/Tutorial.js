import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { TutorialDialog } from "components/Dialog";

const Tutorial = () => {
  const theme = useTheme();
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const [open, setOpen] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onClick handler
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? 3 : 1.5,
          py: !drawerOpen ? 1.25 : 1,
          ...(drawerOpen && {
            "&:hover": {
              bgcolor: theme.palette.background.secondary,
              borderRadius: "10px",
            },
          }),
          ...(!drawerOpen && {
            "&:hover": {
              bgcolor: "transparent",
            },
          }),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: theme.palette.text.primary,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                bgcolor: "secondary.lighter",
              },
            }),
          }}
        >
          <i
            className="fi fi-rr-clapperboard-play"
            style={{
              fontSize: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></i>
        </ListItemIcon>

        {drawerOpen && (
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  paddingLeft: "10px",
                }}
              >
                Eğitim
              </Typography>
            }
          />
        )}
      </ListItemButton>

      {/* Tutorial video */}
      <TutorialDialog open={open} onClose={handleClose} />
    </>
  );
};

export default Tutorial;
