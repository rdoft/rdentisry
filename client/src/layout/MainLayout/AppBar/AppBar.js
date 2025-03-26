import { useTheme } from "@mui/material/styles";
import { AppBar as MuiAppBar, Box, IconButton, Toolbar, Divider } from "@mui/material";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import config from "config/theme.config";

// assets
import { SidebarIcon } from "assets/images/icons";

const AppBar = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();

  return (
    <MuiAppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: {
          xs: "100%",
          lg: open 
            ? `calc(100% - ${config.drawer.width}px - 8px)` 
            : `calc(100% - ${config.drawer.miniWidth}px - 8px)`,
        },
        marginLeft: {
          xs: "0",
          lg: open 
            ? `${config.drawer.width + 8}px` 
            : `${config.drawer.miniWidth + 8}px`,
        },
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: "48px",
        backgroundColor: theme.palette.background.default,
        zIndex: config.zIndex.appBar,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: "100%",
          minHeight: "48px !important",
          px: {
            xs: "8px",
            sm: "12px",
            lg: "8px",
          },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            color: theme.palette.text.primary,
            padding: 0.5,
            ml: 0,
            display: 'flex',
          }}
        >
          <Box
            component="img"
            src={SidebarIcon}
            alt="Toggle Sidebar"
            sx={{ width: 16, height: 16 }}
          />
        </IconButton>
        
        <Divider 
          orientation="vertical" 
          variant="middle"
          flexItem
          sx={{ 
            mx: 0.75, 
            height: 16, 
            alignSelf: 'center',
            color: theme.palette.text.primary,
          }} 
        />
        
        <Breadcrumbs />
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

export default AppBar; 