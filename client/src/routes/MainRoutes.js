import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MainLayout from "layout/MainLayout";

// render - sample page
const Patients = Loadable(lazy(() => import("pages/patient")));
const Overview = Loadable(lazy(() => import("pages/overview")));

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
