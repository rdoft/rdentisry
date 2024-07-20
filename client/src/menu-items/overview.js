import { Avatar } from "@mui/material";

// assets
import { CalendarActiveIcon, CalendarPassiveIcon } from "assets/images/icons";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const overview = {
  id: "group-overview",
  title: "GENEL",
  type: "group",
  children: [
    // {
    //   id: "overview",
    //   title: "Genel",
    //   type: "item",
    //   url: "/overview",
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false,
    // },
    {
      id: "calendar",
      title: "Takvim",
      type: "item",
      url: "/calendar",
      iconActive: (
        <Avatar
          src={CalendarActiveIcon}
          shape="circle"
          style={{ width: "24px", height: "24px", padding: "1px" }}
        />
      ),
      iconPassive: (
        <Avatar
          src={CalendarPassiveIcon}
          shape="circle"
          style={{ width: "24px", height: "24px", padding: "1px" }}
        />
      ),
      breadcrumbs: false,
    },
  ],
};

export default overview;
