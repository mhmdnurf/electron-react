import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./router";
// import "./App.css";

function App(): React.JSX.Element {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
