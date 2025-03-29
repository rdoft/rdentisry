import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navigation from "./Navigation/Navigation";
import SimpleBar from "components/SimpleBar";
import Profile from "./Profile/Profile";
import AuxiliaryNavigation from "./AuxiliaryNavigation";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  // Scrollable drawer content
  const content = (
    <>
      <Box sx={{ px: 1, mb: "auto" }}>
        <Navigation />
      </Box>
      <Box sx={{ px: 1, mt: matchDownMD ? 4 : 1 }}>
        <AuxiliaryNavigation />
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Scrollable area for navigation and other actions */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <SimpleBar
          sx={{
            height: "100%",
            "& .simplebar-content": {
              display: "flex",
              flexDirection: "column",
              height: "100%",
            },
            "& .MuiButtonBase-root": {
              borderRadius: 1,
              py: 0.75,
              width: "100%",
              mb: 0.5,
            },
          }}
        >
          {content}
        </SimpleBar>
      </Box>

      {/* Profile component fixed at the bottom */}
      <Box
        sx={{
          px: 1,
          py: matchDownMD ? 1.5 : 1,
        }}
      >
        <Profile />
      </Box>
    </Box>
  );
};

export default DrawerContent;
