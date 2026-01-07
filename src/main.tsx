import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { DateProvider } from "./context/Date.context";
import { LocationProvider } from "./context/Location.context";
import "./i18n/config";
import "./index.css";
import ActiveButtonCallsPage from "./pages/ActiveButtonCallsPage";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <DateProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/:location/active-calls"
                element={<ActiveButtonCallsPage />}
              />
              <Route path="/:location/:tableName" element={<App />} />
              <Route path="*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </DateProvider>
      </LocationProvider>
    </QueryClientProvider>
  </StrictMode>
);
