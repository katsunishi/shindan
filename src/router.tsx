import { Navigate, createBrowserRouter } from "react-router-dom";
import { DiagnosePage } from "./pages/DiagnosePage";
import { ResultPage } from "./pages/ResultPage";
import { TypesPage } from "./pages/TypesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DiagnosePage />
  },
  {
    path: "/result/:type",
    element: <ResultPage />
  },
  {
    path: "/types",
    element: <TypesPage />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
