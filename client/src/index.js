import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// prime-react
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// scroll bar
import "simplebar/dist/simplebar.css";

// third-party
import { Provider as ReduxProvider } from "react-redux";

// project import
import App from "./App";
import { store } from "store";
import { AuthProvider, LoadingProvider, SubscriptionProvider } from "context";

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ReduxProvider store={store}>
    <BrowserRouter basename="/">
      <LoadingProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <App />
          </SubscriptionProvider>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </ReduxProvider>
);
