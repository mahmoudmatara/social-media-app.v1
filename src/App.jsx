import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NotFound from "./Components/NotFound/NotFound";
import { HeroUIProvider } from "@heroui/react";
import AuthContextProvider from "./Context/AuthContext";
import Profile from "./Components/Profile/Profile";
import Setting from "./Components/Setting/Setting";
import Page from "./Components/Page/Page";
import AuthProtect from "./Components/AuthProtect/AuthProtect";
import AntiAuthProtect from "./Components/AntiAuthProtect/AntiAuthProtect";
import Posts from "./Components/Posts/Posts";
import Community from "./Components/Community/Community";
import Saved from "./Components/Saved/Saved";
import Notifications from "./Components/Notifications/Notifications";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import { useNetworkState } from "react-use";
import DetectOnlin from "./Components/DetectOnlin/DetectOnlin";
import { HelmetProvider } from "react-helmet-async";

const query = new QueryClient();

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: (
          <AuthProtect>
            <Home />
          </AuthProtect>
        ),
        children: [
          { index: true, element: <Page /> },
          { path: "page", element: <Page /> },
          { path: "posts", element: <Posts /> },
          { path: "community", element: <Community /> },
          { path: "saved", element: <Saved /> },
        ],
      },

      {
        path: "profile",
        element: (
          <AuthProtect>
            <Profile />
          </AuthProtect>
        ),
      },
      {
        path: "postDetails/:id",
        element: (
          <AuthProtect>
            <PostDetails />
          </AuthProtect>
        ),
      },

      {
        path: "setting",
        element: (
          <AuthProtect>
            <Setting />
          </AuthProtect>
        ),
      },

      {
        path: "notifications",
        element: (
          <AuthProtect>
            <Notifications />
          </AuthProtect>
        ),
      },

      { path: "page", element: <Navigate to="/home/page" replace /> },

      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "register",
    element: (
      <AntiAuthProtect>
        <Register />
      </AntiAuthProtect>
    ),
  },
  {
    index: true,
    element: (
      <AntiAuthProtect>
        <Login />
      </AntiAuthProtect>
    ),
  },
  {
    path: "login",
    element: (
      <AntiAuthProtect>
        <Login />
      </AntiAuthProtect>
    ),
  },
]);

function App() {
  const { online } = useNetworkState();
  return (
    <>
      {!online && <DetectOnlin />}

      <AuthContextProvider>
        <QueryClientProvider client={query}>
          <HelmetProvider>
            <HeroUIProvider>
              <RouterProvider router={router} />
            </HeroUIProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
