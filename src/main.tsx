import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import UIDialogs from "./components/ui/UIDialogs";
import * as Tooltip from "@radix-ui/react-tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Tooltip.Provider>
      <App />
      <UIDialogs />
    </Tooltip.Provider>
  </StrictMode>
);
