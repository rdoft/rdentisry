import { Box } from "@mui/material";
import Navigation from "./Navigation/Navigation";
import SimpleBar from "components/SimpleBar";
import Profile from "./Profile/Profile";
import Notification from "./Notification/Notification";
import Tutorial from "./Support/Tutorial";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      height: "100%",
      "& .simplebar-content": {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
    }}
  >
    <Navigation />
    <Box sx={{ flexGrow: 1 }} />
    <Notification />
    <Tutorial />
    <Profile />
  </SimpleBar>
);

export default DrawerContent;
