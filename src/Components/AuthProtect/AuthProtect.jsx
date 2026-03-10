import React from "react";
import { useContext } from "react";
import { AuthContext } from "./../../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthProtect({ children }) {
  const { tokenUser } = useContext(AuthContext);

  if (!tokenUser) {
    return <Navigate to="/login" />;
  }

  return children;
}
