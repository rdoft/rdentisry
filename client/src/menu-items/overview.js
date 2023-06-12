// assets
import { DashboardOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { AppstoreOutlined, ScheduleOutlined } from "@ant-design/icons";

// icons
const icons = {
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ScheduleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const overview = {
  id: "group-overview",
  title: "Genel",
  type: "group",
  children: [
    {
      id: "home",
      title: "Anasayfa",
      type: "item",
      url: "/home",
      icon: icons.AppstoreOutlined,
      breadcrumbs: false,
    },
    {
      id: "overview",
      title: "Genel",
      type: "item",
      url: "/overview",
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
    },
    {
      id: "calendar",
      title: "Takvim",
      type: "item",
      url: "/calendar",
      icon: icons.ScheduleOutlined,
      breadcrumbs: false,
    },
  ],
};

export default overview;
