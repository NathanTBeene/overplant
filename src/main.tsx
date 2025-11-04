import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { AppProvider } from "./providers/AppProvider";
import * as Tooltip from "@radix-ui/react-tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <Tooltip.Provider>
        <App />
      </Tooltip.Provider>
    </AppProvider>
  </StrictMode>
);
