import React, { lazy } from "react";
import { Loadable } from "components/Loadable";
import { MainLayout } from "layout";
import ProtectedRoute from "routes/ProtectedRoute";
import PublicRoute from "routes/PublicRoute";

// render - pages
// const Overview = Loadable(lazy(() => import("pages/Overview/OverviewPage")));
const Patients = Loadable(lazy(() => import("pages/Patients/PatientsPage")));
const Patient = Loadable(lazy(() => import("pages/Patients/PatientPage")));
const Calendar = Loadable(
  lazy(() => import("pages/AppointmentCalendar/AppointmentCalendarPage"))
);
const Procedures = Loadable(
  lazy(() => import("pages/Procedures/ProceduresPage"))
);
const Login = Loadable(lazy(() => import("pages/Auth/LoginPage")));
const Register = Loadable(lazy(() => import("pages/Auth/RegisterPage")));
const Forgot = Loadable(lazy(() => import("pages/Auth/ForgotPage")));
const ResetPassword = Loadable(
  lazy(() => import("pages/Auth/ResetPasswordPage"))
);
const Verify = Loadable(lazy(() => import("pages/Auth/VerifyPage")));
const Verified = Loadable(lazy(() => import("pages/Auth/VerifiedPage")));
const NotFound = Loadable(lazy(() => import("pages/Other/NotFoundPage")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
  {
    path: "/login",
    element: <PublicRoute element={Login} />,
  },
  {
    path: "/register",
    element: <PublicRoute element={Register} />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verify",
    element: <ProtectedRoute element={Verify} />,
  },
  {
    path: "/verify/:token",
    element: <ProtectedRoute element={Verified} />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={MainLayout} />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={Calendar} />,
      },
      // {
      //   path: "/overview",
      //   element: <Overview />,
      // },
      {
        path: "patients",
        element: <ProtectedRoute element={Patients} />,
      },
      {
        path: "patients/:id",
        element: <ProtectedRoute element={Patient} />,
      },
      {
        path: "/procedures",
        element: <ProtectedRoute element={Procedures} />,
      },
    ],
  },
  {
    path: "/*",
    element: <NotFound />,
  },
];

export default MainRoutes;
