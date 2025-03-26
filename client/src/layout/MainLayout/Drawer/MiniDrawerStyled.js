// material-ui
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import config from "config/theme.config";

const openedMixin = (theme) => ({
  width: config.drawer.width,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  boxShadow: "none",
  backgroundColor: "transparent",
  zIndex: config.zIndex.drawer,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: config.drawer.miniWidth,
  boxShadow: "none",
  backgroundColor: "transparent",
  zIndex: config.zIndex.drawer,
  [theme.breakpoints.down("lg")]: {
    width: 0,
  },
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? config.drawer.width : config.drawer.miniWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  zIndex: config.zIndex.drawer,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default MiniDrawerStyled;
