// assets
import { DashboardOutlined } from "@ant-design/icons";

// icons
const icons = {
  DashboardOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const overview = {
  id: "group-overview",
  title: "Genel",
  type: "group",
  children: [
    {
      id: "overview",
      title: "Genel",
      type: "item",
      url: "/overview",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
  ],
};

export default overview;
