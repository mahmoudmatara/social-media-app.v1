import React from "react";
import { useContext } from "react";
import { AuthContext } from "./../../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AntiAuthProtect({ children }) {
  const { tokenUser } = useContext(AuthContext);

  if (tokenUser) {
    return <Navigate to="/home" />;
  }

  return children;
}
