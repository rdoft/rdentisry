import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSubscription } from "context/SubscriptionProvider";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";

// project import
import navigation from "menu-items";
import Drawer from "./Drawer/Drawer";
import ToggleDrawer from "./ToggleDrawer/ToggleDrawer";
import Breadcrumbs from "components/@extended/Breadcrumbs";
import { PremiumDialog } from "components/Dialog";
import config from "config/theme.config";

// types
import { openDrawer } from "store/reducers/menu";

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { dialog } = useSubscription();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
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
      <ToggleDrawer open={open} handleDrawerToggle={handleDrawerToggle} />
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            lg: `calc(100% - ${open ? config.drawer.width + 32 : 0}px)`,
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
            xs: "calc(56px + 1rem)",
            sm: "calc(64px + 1.5rem)",
            md: "calc(64px + 2rem)",
          },
          pr: { lg: 3 },
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Breadcrumbs
          navigation={navigation}
          title
          titleBottom
          card={false}
          divider={false}
          sx={{
            mb: { xs: 1.5, sm: 2, md: 2.5 },
            bgcolor: "transparent",
            px: { xs: 0.5, sm: 1 },
          }}
        />
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
