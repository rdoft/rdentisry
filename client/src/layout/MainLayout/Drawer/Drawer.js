import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, SwipeableDrawer, useMediaQuery } from "@mui/material";

// project import
import DrawerHeader from "./DrawerHeader/DrawerHeader";
import DrawerContent from "./DrawerContent/DrawerContent";
import MiniDrawerStyled from "./MiniDrawerStyled";
import config from "config/theme.config";

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ open, handleDrawerToggle, window }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  // responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined;

  // memoized components
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

  // drawer styles
  const drawerStyles = {
    width: config.drawer.width,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...theme.mixins.drawer.openedMixin(theme),
      "& .MuiDrawer-paper": {
        ...theme.mixins.drawer.openedMixin(theme),
        border: "none",
        borderRadius: { md: "16px" },
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
        margin: { md: "8px 0 8px 8px" },
        height: { md: "calc(100vh - 16px)" },
      },
    }),
    ...(!open && {
      ...theme.mixins.drawer.closedMixin(theme),
      "& .MuiDrawer-paper": {
        ...theme.mixins.drawer.closedMixin(theme),
        border: "none",
        borderRadius: { md: "16px" },
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
        margin: { md: "8px 0 8px 8px" },
        height: { md: "calc(100vh - 16px)" },
      },
    }),
  };

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        zIndex: theme.zIndex.drawer,
      }}
      aria-label="mailbox folders"
    >
      {!matchDownMD ? (
        <MiniDrawerStyled variant="permanent" open={open} sx={drawerStyles}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <SwipeableDrawer
          container={container}
          anchor={matchDownSM ? "left" : "left"}
          open={open}
          onClose={handleDrawerToggle}
          onOpen={handleDrawerToggle}
          disableBackdropTransition={!matchDownSM}
          disableDiscovery={matchDownSM}
          swipeAreaWidth={20}
          variant="temporary"
          ModalProps={{
            keepMounted: true,
            BackdropProps: {
              sx: {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.7)"
                    : "rgba(0, 0, 0, 0.5)",
              },
            },
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: config.drawer.width,
              backgroundColor: theme.palette.background.paper,
              backgroundImage: "none",
              ...(matchDownSM
                ? {
                    height: "calc(100% - 16px)",
                    margin: "8px",
                    borderRadius: "16px",
                    "& > *": {
                      padding: "0 8px",
                    },
                  }
                : {
                    height: "calc(100% - 16px)",
                    margin: "8px",
                    borderRadius: "16px",
                    border: "none",
                    "& > *": {
                      padding: "0 8px",
                    },
                  }),
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              pt: 2,
              overflow: "hidden",
            }}
          >
            {drawerHeader}
            {drawerContent}
          </Box>
        </SwipeableDrawer>
      )}
    </Box>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  window: PropTypes.func,
};

export default MainDrawer;
