import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import { MainLayout } from "layout";

// render - pages
const Patients = Loadable(lazy(() => import("pages/Patients/PatientsPage")));
const Overview = Loadable(lazy(() => import("pages/Overview/OverviewPage")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <Overview />,
    },
    {
      path: "/overview",
      element: <Overview />,
    },
    {
      path: "patients",
      element: <Patients />,
    },
  ],
};

export default MainRoutes;
