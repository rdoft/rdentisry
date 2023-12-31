// project import
import Routes from "routes";
import ThemeCustomization from "themes";
import ScrollTop from "components/ScrollTop";

// assets
import "react-big-calendar/lib/css/react-big-calendar.css";
import "assets/styles/App.css"

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
