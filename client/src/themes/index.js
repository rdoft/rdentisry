import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// project import
import Palette from "./palette";
import Typography from "./typography";
import CustomShadows from "./shadows";
import componentsOverride from "./overrides";
import config from "config/theme.config";

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }) {
  const theme = Palette("light", "default");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1536,
        },
      },
      direction: "ltr",
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
        drawer: {
          width: config.drawer.width,
          closedWidth: 72,
          openedMixin: (theme) => ({
            width: config.drawer.width,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down("sm")]: {
              width: "100%",
              position: "fixed",
              left: 0,
            },
            [theme.breakpoints.between("sm", "md")]: {
              width: 240,
            },
            [theme.breakpoints.up("md")]: {
              width: config.drawer.width,
            },
          }),
          closedMixin: (theme) => ({
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
            width: theme.spacing(7),
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.up("sm")]: {
              width: theme.spacing(9),
            },
            "& .MuiListItemIcon-root": {
              transition: theme.transitions.create(["margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              marginLeft: "auto",
              marginRight: "auto",
            },
          }),
          mobileDrawer: {
            xs: {
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: "100%",
                height: "calc(100% - 56px)",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderWidth: 0,
                backgroundColor: "background.paper",
                marginTop: "auto",
              },
            },
            sm: {
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
                borderWidth: 0,
                backgroundColor: "background.paper",
                boxShadow: theme.shadows[8],
              },
            },
          },
        },
      },
      transitions: {
        duration: {
          enteringScreen: 200,
          leavingScreen: 150,
        },
      },
      zIndex: {
        appBar: config.zIndex?.appBar || 1100,
        drawer: config.zIndex?.drawer || 1200,
        modal: config.zIndex?.modal || 1300,
        dialog: config.zIndex?.dialog || 1400,
        tooltip: config.zIndex?.tooltip || 1500,
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography,
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node,
};
