import { Avatar } from "@mui/material";

// assets
import {
  PatientListActiveIcon,
  PatientListPassiveIcon,
  ProcedureActiveIcon,
  ProcedurePassiveIcon,
} from "assets/images/icons";

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const patients = {
  id: "group-patients",
  title: "KLİNİK",
  type: "group",
  children: [
    {
      id: "patients",
      title: "Hastalar",
      type: "item",
      url: "/patients",
      iconActive: (
        <Avatar
          src={PatientListActiveIcon}
          shape="circle"
          style={{ width: "24px", height: "24px", padding: "1px" }}
        />
      ),
      iconPassive: (
        <Avatar
          src={PatientListPassiveIcon}
          shape="circle"
          style={{ width: "24px", height: "24px", padding: "1px" }}
        />
      ),
      breadcrumbs: false,
    },
    {
      id: "procedures",
      title: "Tedaviler",
      type: "item",
      url: "/procedures",
      iconActive: (
        <Avatar
          src={ProcedureActiveIcon}
          shape="circle"
          style={{ width: "24px", height: "24px", padding: "1px" }}
        />
      ),
      iconPassive: (
        <Avatar
          src={ProcedurePassiveIcon}
          shape="circle"
          style={{ width: "24px", height: "24px", padding: "1px" }}
        />
      ),
      breadcrumbs: false,
    },
  ],
};

export default patients;
