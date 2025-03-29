import { List } from "@mui/material";
import { useSelector } from "react-redux";

import Automation from "./Automation/Automation";
import Tutorial from "./Support/Tutorial";
import Notification from "./Notification/Notification";

const AuxiliaryNavigation = () => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  return (
    <List
      sx={{
        mb: drawerOpen ? 1.5 : 0,
        py: 0,
        zIndex: 0,
      }}
    >
      <Automation />
      <Tutorial />
      <Notification />
    </List>
  );
};

export default AuxiliaryNavigation;
