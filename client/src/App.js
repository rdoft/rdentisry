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
        style: {
          opacity: 0.8,
          borderRadius: "10px",
          background: "#D7DAE4",
          color: "#182A4C",
          padding: "0.8rem",
        },
        position: "bottom-center",
      }}
    />
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
