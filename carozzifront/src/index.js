import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./Root";
import ErrorPage from "./ErrorPage";
import Home from "./components/Home";
import ListMaintainer from "./components/ListMaintainer";
import ListShifts from "./components/ListShifts";
import ListWorkers from "./components/ListWorkers";
import FormBinnacle from "./components/FormBinnacle";
import Binnacle from "./components/Binnacle";
import FacilityFinder from "./components/FacilityFinder";
import GestOptions from "./components/GestOptions";
import Login from "./components/LoginComp";
import ListProfiles from "./components/ListProfiles";
import GestPermissions from "./components/GestPermissions";
import GestUserProfile from "./components/GestUserProfile";
import Root2 from "./Root2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/binnacle",
        element: <Binnacle />,
      },
      {
        path: "/workers",
        element: <ListWorkers />,
      },
      {
        path: "/mantenedores",
        element: <ListMaintainer />,
      },
      {
        path: "/jefesTurno",
        element: <ListShifts />,
      },
      {
        path: "/formBinnacle",
        element: <FormBinnacle />,
      },      
    ],
  },
  {
    path: "/",
    element: <Root2 />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/facilities",
        element: <FacilityFinder />,
      },
      {
        path: "/failsTypes",
        element: <GestOptions option="fails" />
      },
      {
        path: "/failsModes",
        element: <GestOptions option="failsMode" />
      },
      {
        path: "/mantsTypes",
        element: <GestOptions option="mantType" />
      },
      {
        path: "/intTypes",
        element: <GestOptions option="intType" />
      },
      {
        path: "/activities",
        element: <GestOptions option="activities" />
      },
      {
        path: "/equipStatus",
        element: <GestOptions option="equipStatus" />
      },
      {
        path: "/specialities",
        element: <GestOptions option="specialities" />
      },
      {
        path: "/users",
        element: <ListProfiles />
      },
      {
        path: "/profiles",
        element: <GestOptions option="profiles" />
      },
      {
        path: "/accesList",
        element: <GestOptions option="accesList" />
      },
      {
        path: "/permissionsProfile",
        element: <GestPermissions/>
      },
      {
        path: "/profilesUser",
        element: <GestUserProfile/>
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);