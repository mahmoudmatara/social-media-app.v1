import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaEnvelope,
  FaUsers,
  FaFileAlt,
  FaBookmark,
  FaClock,
  FaThumbsUp,
  FaComment,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { AuthContext } from "./../../Context/AuthContext";
import { Helmet } from "react-helmet-async";

export default function Profile() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("my-posts");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { setuserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: userLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/profile-data`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        })
        .then((res) => res.data.data.user),
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userData?._id],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/${userData?._id}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        })
        .then((res) => res.data.data.posts || []),
    enabled: !!userData?._id,
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (formData) =>
      axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        }
      ),

    onSuccess: (res) => {
      const newPhotoUrl = res.data.data.photo;
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setuserData((prev) => {
        const updated = { ...prev, photo: newPhotoUrl };
        localStorage.setItem("UserData", JSON.stringify(updated));
        return updated;
      });

      toast.success("Profile photo updated successfully!");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    },
  });
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);
      uploadPhotoMutation.mutate(formData);
    }
  };
  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["userBookmarks"],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/bookmarks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        })
        .then((res) => res.data.data.bookmarks || []),
  });
  // console.log(userData);

  const user = useMemo(() => {
    if (!userData) return null;
    return { ...userData, posts: postsData || [] };
  }, [userData, postsData]);

  const currentPosts =
    activeTab === "my-posts" ? postsData || [] : bookmarksData || [];
  if (userLoading)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading profile...
      </div>
    );
  if (isError || !userData)
    return (
      <div className="text-center p-20 text-red-500">
        Error loading profile.
      </div>
    );



  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <Helmet>
        <title>
          {userData?.name ? `${userData.name} | Route Posts` : "Profile"}
        </title>{" "}
      </Helmet>
      <main className="min-w-0">
        <div className="space-y-5 sm:space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
            <div className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"></div>
              <div className="absolute right-2 top-2 z-10 flex items-center justify-end gap-1.5 sm:opacity-0 sm:group-hover/cover:opacity-100 transition duration-200">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-black/60">
                  <FaCamera size={13} /> Add cover
                  <input accept="image/*" className="hidden" type="file" />
                </label>
              </div>
            </div>

            <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
              <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-end gap-4">
                      <div className="group/avatar relative shrink-0">
                        <img
                          alt={user.name}
                          className="h-28 w-28 cursor-pointer rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe] sm:h-32 sm:w-32"
                          src={user.photo}
                          onClick={() => {
                            setSelectedImage(user.photo);
                            setShowModal(true);
                          }}
                        />
                        <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm hover:bg-[#166fe5] transition-all">
                          {uploadPhotoMutation.isPending ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaCamera size={17} />
                          )}
                          <input
                            accept="image/*"
                            className="hidden"
                            type="file"
                            onChange={handlePhotoChange}
                            disabled={uploadPhotoMutation.isPending}
                          />
                        </label>
                      </div>

                      <div className="min-w-0 pb-1">
                        <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                          {user.name}
                        </h2>
                        <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                          @
                          {user.username ||
                            user.name.split(" ")[0].toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-3 gap-2 lg:w-130">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
                      <p className="text-[11px] font-bold uppercase text-slate-500">
                        Followers
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {user.followersCount || 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
                      <p className="text-[11px] font-bold uppercase text-slate-500">
                        Following
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {user.followingCount || 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
                      <p className="text-[11px] font-bold uppercase text-slate-500">
                        Bookmarks
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {userData?.bookmarksCount || bookmarksData?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      About
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <FaEnvelope /> {user.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaUsers /> Active on Route Posts
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                      <p className="text-xs font-bold uppercase text-[#1f4f96]">
                        My posts
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        {user.posts?.length || 0}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                      <p className="text-xs font-bold uppercase text-[#1f4f96]">
                        Saved posts
                      </p>
                      <p className="mt-1 text-2xl font-black">
                        {userData?.bookmarksCount || bookmarksData?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto">
                <button
                  onClick={() => setActiveTab("my-posts")}
                  className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeTab === "my-posts"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FaFileAlt size={15} /> My Posts
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeTab === "saved"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FaBookmark size={15} /> Saved
                </button>
              </div>
              <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
                {currentPosts.length}
              </span>
            </div>

            <div className="space-y-4">
              {postsLoading ? (
                <div className="text-center py-10 font-bold text-slate-500">
                  Loading posts...
                </div>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <article
                    key={post._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.photo}
                            className="h-10 w-10 rounded-full object-cover"
                            alt=""
                          />
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/postDetails/${post._id}`)}
                          className="rounded-md cursor-pointer px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
                        >
                          View details
                        </button>
                      </div>
                      <div className="pt-3">
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
                          {post.body}
                        </p>
                      </div>
                    </div>

                    {post.image && (
                      <div className="border-y border-slate-200 bg-slate-950/95">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(post.image);
                            setShowModal(true);
                          }}
                          className="group relative block w-full"
                        >
                          <img
                            src={post.image}
                            className="max-h-140 mx-auto w-auto object-contain"
                            alt="post"
                          />
                          <span className="absolute inset-0 cursor-pointer bg-black/0 transition group-hover:bg-black/10"></span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                      <div className="flex gap-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <FaThumbsUp className="text-[#1877f2]" size={14} />{" "}
                          {post.likes?.length ?? "9"} likes
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <FaRepeat className="text-[#1877f2]" size={14} />{" "}
                          {post.sharesCount ?? "9"} share
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <FaComment className="text-[#1877f2]" size={14} />{" "}
                          {post.commentsCount ?? "9"} comments
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <FaClock size={13} />{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                  {activeTab === "saved"
                    ? "You haven't bookmarked any posts yet."
                    : "No posts found."}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 h-full z-100 flex items-center justify-center bg-black/90 sm:p-8"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-white hover:bg-white/20 p-2 rounded-full"
          >
            <FaTimes size={20} />
          </button>
          <img
            src={selectedImage}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
