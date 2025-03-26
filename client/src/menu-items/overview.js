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
    {
      id: "calendar",
      title: "Takvim",
      type: "item",
      url: "/",
      icon: CalendarActiveIcon,
      breadcrumbs: true,
    },
  ],
};

export default overview;
