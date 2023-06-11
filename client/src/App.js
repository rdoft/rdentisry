// project import
import Routes from "routes";
import ThemeCustomization from "themes";
import ScrollTop from "components/ScrollTop";
import { Toaster } from "react-hot-toast";
import "react-big-calendar/lib/css/react-big-calendar.css"

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <Toaster
      toastOptions={{
        // Define default options
        className: "",
        duration: 3000,
        style: {
          background: "#fee9e7",
          color: "#000",
          minWidth: "300px",
          minHeight: "80px"
        },
        position: "bottom-right",
        success: {
          style: {
            borderLeft: "5px solid lightgreen",
          },
        },
        error: {
          style: {
            borderLeft: "5px solid red",
          },
        },
      }}
      
    />
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
