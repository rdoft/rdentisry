import { cacheImages } from "utils";

// assets
import {
  PatientListActiveIcon,
  ProcedureActiveIcon,
} from "assets/images/icons";

cacheImages([PatientListActiveIcon, ProcedureActiveIcon]);

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const clinic = {
  id: "group-clinic",
  title: "KLİNİK",
  type: "group",
  children: [
    {
      id: "patients",
      title: "Hastalar",
      type: "item",
      url: "/patients",
      icon: "fi fi-rr-id-card-clip-alt",
      breadcrumbs: true,
    },
    {
      id: "procedures",
      title: "Tedaviler",
      type: "item",
      url: "/procedures",
      icon: "fi fi-rr-stethoscope",
      breadcrumbs: true,
    },
  ],
};

export default clinic;
