import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <div className="font-cairo bg-gray-100 text-gray-700">
        <Navbar />
        <div className="min-h-screen bg-[rgb(240 242 245)] font-sans text-gray-800">
        <div className="pt-22.5 max-w-[85%] mx-auto px-4">
        <Outlet />
        </div>
        </div>
      </div>
    </>
  );
}
