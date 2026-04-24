import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { TooltipProvider } from "./shared/components/TooltipProvider";

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </TooltipProvider>,
);
