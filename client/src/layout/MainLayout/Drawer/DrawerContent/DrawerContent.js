import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navigation from "./Navigation/Navigation";
import SimpleBar from "components/SimpleBar";
import Profile from "./Profile/Profile";
import Notification from "./Notification/Notification";
import Tutorial from "./Support/Tutorial";
import Automation from "./Automation/Automation";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const bottomActions = (
    <Box
      sx={{
        width: '100%',
        bgcolor: theme.palette.background.paper,
        mt: 'auto',
        py: 1,
        '& > *': {
          px: 1,
        },
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Automation />
        <Tutorial />
        <Notification />
      </Box>
      <Box sx={{ mb: matchDownSM ? 0 : 1 }}>
        <Profile />
      </Box>
    </Box>
  );

  const content = (
    <>
      <Box sx={{ px: 1, mb: 'auto' }}>
        <Navigation />
      </Box>
      {bottomActions}
    </>
  );

  return matchDownMD ? (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        '& .MuiButtonBase-root': {
          borderRadius: 1,
          py: 0.75,
          width: '100%',
          mb: 0.5,
        },
      }}
    >
      {content}
    </Box>
  ) : (
    <SimpleBar
      sx={{
        height: "100%",
        bgcolor: theme.palette.background.paper,
        "& .simplebar-content": {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)',
        },
        '& .MuiButtonBase-root': {
          borderRadius: 1,
          py: 0.75,
          width: '100%',
          mb: 0.5,
        },
      }}
    >
      {content}
    </SimpleBar>
  );
};

export default DrawerContent;
