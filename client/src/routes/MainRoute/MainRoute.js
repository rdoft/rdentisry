import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import { MainLayout } from "layout";

// render - pages
// const Overview = Loadable(lazy(() => import("pages/Overview/OverviewPage")));
const Patients = Loadable(lazy(() => import("pages/Patients/PatientsPage")));
const Patient = Loadable(lazy(() => import("pages/Patients/PatientPage")));
const Calendar = Loadable(
  lazy(() => import("pages/AppointmentCalendar/AppointmentCalendarPage"))
);
const Procedures = Loadable(lazy(() => import("pages/Procedures/ProceduresPage")));
const Login = Loadable(lazy(() => import("pages/Auth/LoginPage")));
const Register = Loadable(lazy(() => import("pages/Auth/RegisterPage")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Calendar />,
      },
      // {
      //   path: "/overview",
      //   element: <Overview />,
      // },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "patients/:id",
        element: <Patient />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
      },
      {
        path: "/procedures",
        element: <Procedures />,
      }
    ],
  },
  // {
  //   path: "/*",
  //   element: <NotFound />,
  // },
];

export default MainRoutes;
