import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AppProvider } from "./lib/store";
import App from "./App";
import "./styles.css";

const legacy: Record<string, string> = {
  home: "/",
  cal: "/train",
  cut: "/approach",
  food: "/nutrition",
  track: "/progress",
};
if (legacy[location.hash.slice(1)])
  history.replaceState(null, "", legacy[location.hash.slice(1)]);
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
