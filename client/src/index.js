import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// scroll bar
import 'simplebar/dist/simplebar.css';

// third-party
import { Provider as ReduxProvider } from "react-redux";

// project import
import App from "./App";
import { store } from "store";

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>
);
