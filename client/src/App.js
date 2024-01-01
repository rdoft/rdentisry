// project import
import Routes from "routes";
import ThemeCustomization from "themes";
import ScrollTop from "components/ScrollTop";
import { Toaster } from "react-hot-toast";

// assets
import "react-big-calendar/lib/css/react-big-calendar.css";
import "assets/styles/App.css";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <Toaster
      toastOptions={{
        // Define default options
        className: "",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "rgba(51, 51, 51, 0.6)",
          color: "#fff",
        },
        position: "bottom-right",
      }}
    />
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
