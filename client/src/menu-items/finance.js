import { cacheImages } from "utils";

// assets
import { PricingIcon } from "assets/images/icons";

cacheImages([PricingIcon]);

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const finance = {
  id: "group-finance",
  title: "FİNANS",
  type: "group",
  children: [
    {
      id: "pricing",
      title: "Üyelik",
      type: "item",
      url: "/pricing",
      icon: PricingIcon,
      breadcrumbs: false,
    },
  ],
};

export default finance;
