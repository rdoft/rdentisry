// assets
import { TeamOutlined } from "@ant-design/icons";

// icons
const icons = {
  TeamOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const patients = {
  id: "group-patients",
  title: "Hasta",
  type: "group",
  children: [
    {
      id: "patients-list",
      title: "Hasta Listesi",
      type: "item",
      url: "/patients",
      icon: icons.TeamOutlined,
      breadcrumbs: false,
    },
  ],
};

export default patients;
