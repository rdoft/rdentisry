// assets
import { BgColorsOutlined, FontSizeOutlined } from "@ant-design/icons";

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const reports = {
  id: "reports",
  title: "Rapor",
  type: "group",
  children: [
    {
      id: "report-1",
      title: "Rapor 1",
      type: "item",
      url: "/report-1",
      icon: icons.FontSizeOutlined,
    },
    {
      id: "report-2",
      title: "Rapor 2",
      type: "item",
      url: "/report-2",
      icon: icons.BgColorsOutlined,
    },
  ],
};

export default reports;
