import React from "react";
import Dashboard from "./pages/Dashboard";
import FormJadwal from "./pages/FormJadwal";
import FormAnggaran from "./pages/FormAnggaran";

interface Route {
  path: string;
  element: React.JSX.Element;
}

const routes: Route[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/form-jadwal", element: <FormJadwal /> },
  { path: "/form-anggaran", element: <FormAnggaran /> },
];

export default routes;
