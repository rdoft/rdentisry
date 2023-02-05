import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import { MainLayout } from "layout";

// render - pages
const Home = Loadable(lazy(()=> import("pages/Overview/HomePage")));
const Overview = Loadable(lazy(() => import("pages/Overview/OverviewPage")));
const Patients = Loadable(lazy(() => import("pages/Patients/PatientsPage")));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/home",
      element: <Home />,
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
