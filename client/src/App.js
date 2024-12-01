// project import
import Routes from "routes";
import ThemeCustomization from "themes";
import ScrollTop from "components/ScrollTop";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// assets
import "react-big-calendar/lib/css/react-big-calendar.css";
import "assets/styles/App.css";

const GA_ID = process.env.REACT_APP_GA_ID; // Google Analytics ID

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(GA_ID);
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return (
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
};
export default App;
