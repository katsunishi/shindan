import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { DiagnosisProvider } from "./state/DiagnosisContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DiagnosisProvider>
      <RouterProvider router={router} />
    </DiagnosisProvider>
  </React.StrictMode>,
);
