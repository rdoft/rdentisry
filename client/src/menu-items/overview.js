import { cacheImages } from "utils";

// assets
import { CalendarActiveIcon } from "assets/images/icons";

cacheImages([CalendarActiveIcon]);

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
      url: "/",
      icon: CalendarActiveIcon,
      breadcrumbs: false,
    },
  ],
};

export default overview;
