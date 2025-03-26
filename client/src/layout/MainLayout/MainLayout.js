import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSubscription } from "context/SubscriptionProvider";
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import Drawer from "./Drawer/Drawer";
import AppBar from "./AppBar/AppBar";
import { PremiumDialog } from "components/Dialog";
import config from "config/theme.config";
import { openDrawer } from "store/reducers/menu";

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { dialog } = useSubscription();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);

  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
  }, [matchDownLG, dispatch]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen, open]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AppBar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            lg: open 
              ? `calc(100% - ${config.drawer.width}px - 8px)` 
              : `calc(100% - ${config.drawer.miniWidth}px - 8px)`,
          },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          p: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
            lg: 3,
          },
          pt: {
            xs: "calc(48px + 0.25rem)",
            sm: "calc(48px + 0.25rem)",
            md: "calc(48px + 0.5rem)",
            lg: "calc(48px + 0.5rem)",
          },
          ml: 0,
          mr: 0,
          pr: { lg: 3 },
          minHeight: "100vh",
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            minHeight: "calc(100vh - 180px)",
          }}
        >
          <Outlet />
        </Box>
        {dialog && <PremiumDialog />}
      </Box>
    </Box>
  );
};

export default MainLayout;
