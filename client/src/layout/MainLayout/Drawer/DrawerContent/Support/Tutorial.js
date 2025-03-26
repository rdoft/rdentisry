import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { Box, IconButton, Typography } from "@mui/material";
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
      <Box sx={{ flexShrink: 0, px: 1.5, mb: 1 }}>
        <IconButton
          disableRipple
          sx={{
            px: drawerOpen && 1,
            width: drawerOpen ? 1 : 36,
            justifyContent: drawerOpen && "flex-start",
            color: theme.palette.text.primary,
            "&:hover": { bgcolor: theme.palette.background.secondary },
          }}
          onClick={handleClick}
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
          {drawerOpen && (
            <Typography variant="h6" sx={{ px: "10px" }}>
              Eğitim
            </Typography>
          )}
        </IconButton>
      </Box>

      {/* Tutorial video */}
      <TutorialDialog open={open} onClose={handleClose} />
    </>
  );
};

export default Tutorial;
