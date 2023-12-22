import React from "react";
import FormJadwal from "./pages/FormJadwal";

interface Route {
  path: string;
  element: React.JSX.Element;
}

const routes: Route[] = [{ path: "/", element: <FormJadwal /> }];

export default routes;
