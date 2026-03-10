import React, { useContext, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaHome, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const navigate = useNavigate();
  const { settokenUser, userData, setuserData } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  const handleLogOut = () => {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("UserData");
    settokenUser(null);
    setuserData(null);
    navigate("/login");
  };
  const { data: userQueryData } = useQuery({
    queryKey: ["userProfile"], 
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/profile-data`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        })
        .then((res) => res.data.data.user),
    enabled: !!localStorage.getItem("UserToken"),
  });

  const displayPhoto =
    userQueryData?.photo || userData?.photo || "default-path.png";

    
  const navBarLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
      isActive
        ? "bg-white text-[#0035a0] shadow-sm"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 h-16.25 bg-white border-b border-gray-200 flex items-center justify-center z-50 px-8">
      <div className="max-w-[85%] w-full flex items-center justify-center relative">
        <div
          className="absolute left-0 flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home/page")}
        >
          <div className="bg-[#0035a0] text-white p-2 rounded-lg font-bold text-xs tracking-tighter">
            ROUTE
          </div>
          <h1 className="font-bold text-xl text-[#1e293b] hidden md:block">
            Route Posts
          </h1>
        </div>

        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-full border border-gray-100">
          <NavLink to="/home"  className={navBarLinkClass}>
            <FaHome size={18} /> Feed
          </NavLink>
          <NavLink to="/profile" className={navBarLinkClass}>
            <FaUserCircle size={18} /> Profile
          </NavLink>
          <NavLink to="/notifications" className={navBarLinkClass}>
            <FiMessageCircle size={20} /> Notifications
          </NavLink>
        </div>

        <div className="absolute right-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center cursor-pointer gap-2 p-1 pr-4 rounded-full border border-gray-200 hover:bg-blue-50 transition-all focus:outline-none relative z-60"
          >
            <img
              src={
                displayPhoto ||
                "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
              }
              alt="user"
              className="w-8 h-8 rounded-full bg-cyan-100"
            />
            <span className="font-bold text-sm text-gray-700 hidden sm:block">
              {userData?.name || "Guest"}
            </span>
            <AiOutlineMenu
              size={15}
              className={`text-gray-400${isMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/0"
                onClick={() => setIsMenuOpen(false)}
              ></div>

              <div className="absolute top-12 right-0 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-gray-600 hover:bg-blue-50 rounded-2xl"
                    }`
                  }
                >
                  <FaUserCircle className="text-lg" />
                  <span>Profile</span>
                </NavLink>

                <NavLink
                  to="/setting"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-gray-600 hover:bg-blue-50 rounded-2xl"
                    }`
                  }
                >
                  <FaCog className="text-lg" />
                  <span>Settings</span>
                </NavLink>

                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => {
                    handleLogOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 font-semibold transition-colors hover:bg-red-50 rounded-2xl"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
