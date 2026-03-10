import React, { useContext, useState, useEffect, useRef } from "react";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaChevronDown,
  FaPaperPlane,
  FaImage,
  FaGlobeAmericas,
  FaRegSmile,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { FaRegBookmark } from "react-icons/fa6";
import { LuNewspaper, LuEarth } from "react-icons/lu";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { Textarea } from "@heroui/react";
import CreatePost from "../CreatePost/CreatePost";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const { settokenUser } = useContext(AuthContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textValue, setTextValue] = useState("");
  const emojiPickerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);
  const onEmojiClick = (emojiData) => {
    setTextValue((prev) => prev + emojiData.emoji);
  };

  const sidebarNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 font-bold text-sm ${
      isActive
        ? "bg-[#eef2ff] text-[#4f46e5]"
        : "text-gray-500 hover:bg-[#f5f9ff] hover:text-[#4f46e5]"
    }`;

  return (
    <>
      <div className="grid grid-cols-12 gap-5 px-2 md:px-6 max-w-350` mx-auto">
        <Helmet>
          <title>Home Feed | Route Posts</title>{" "}
        </Helmet>
        <aside className="hidden xl:block lg:col-span-3">
          <div className="sticky top-22.5 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            <nav className="flex flex-col gap-1">
              <NavLink to="" end className={sidebarNavLinkClass}>
                <LuNewspaper size={20} /> Feed
              </NavLink>
              <NavLink to="/home/posts" end className={sidebarNavLinkClass}>
                <LuNewspaper size={20} /> My posts
              </NavLink>
              <NavLink to="/home/community" className={sidebarNavLinkClass}>
                <LuEarth size={20} /> Community
              </NavLink>
              <NavLink to="/home/saved" className={sidebarNavLinkClass}>
                <FaRegBookmark size={20} /> Saved
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 xl:col-span-6 space-y-6">
          <CreatePost />
          <Outlet />
        </main>

        <aside className="hidden xl:block lg:col-span-3">
          <div className="sticky top-22.5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FaUsers className="text-[#4f46e5]" /> Suggested Friends
              </h3>
              <div className="bg-blue-50 py-0.5 px-1.5 rounded-full text-xs font-bold text-gray-600">
                <span>5</span>
              </div>
            </div>

            <div className="relative mb-6">
              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={14}
              />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full bg-[#f8f9fb] border border-transparent rounded-2xl py-3 pl-11 pr-4 text-sm focus:bg-white focus:border-gray-200 outline-none transition-all shadow-inner"
              />
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-2xl p-2 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <button className="flex items-center gap-3">
                      <img
                        src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                        className="w-10 h-10 rounded-full bg-slate-100"
                        alt="friend"
                      />
                      <div className="leading-tight text-left">
                        <p className="font-bold text-[13px]">User Name</p>
                        <p className="text-[11px] text-gray-400">@username</p>
                      </div>
                    </button>
                    <button className="text-[#4f46e5] cursor-pointer bg-[#e7f3ff] p-2 hover:bg-[#87baf97e] transition-all px-3 flex items-center rounded-xl text-[11px] font-bold border border-[#eef2ff]">
                      <FaPlus size={8} /> Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
