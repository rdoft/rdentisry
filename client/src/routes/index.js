import { useRoutes } from "react-router-dom";

// project import
import MainRoute from "./MainRoute/MainRoute";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoute]);
}
