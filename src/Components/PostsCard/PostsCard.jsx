import React, { useState, useContext } from "react";
import { AiFillHeart, AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaPen, FaRegCommentDots, FaShare, FaTimes } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEarthEurope } from "react-icons/fa6";
import { IoRepeatSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-hot-toast";
import CommentDetails from "./../CommentDetails/CommentDetails";
import CommentsPosts from "./../CommentsPost/CommentsPosts";

export default function PostsCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.body);

  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const handleToggle = () => setIsOpen((prev) => !prev);

  function deleteMyPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("UserToken")}` },
    });
  }

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("post deleted successfully 😒");
      queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
      navigate("/");
    },
    onError: () => toast.error("can't delete this post 😁"),
  });

  function updateMyPost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      { body: updatedContent },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
        },
      }
    );
  }

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateMyPost,
    onSuccess: () => {
      toast.success("Post updated! ✅");
      queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update"),
  });

  return (
    <>
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-3">
            <img
              src={post.user.photo}
              className="w-12 h-12 object-cover rounded-full border border-gray-200 shadow-sm"
              alt=""
            />
            <div>
              <button className="font-bold text-gray-800 text-base">
                {post.user.name}
              </button>
              <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                <p>@{post.user.username}</p>
                <span>·</span>
                <button>
                  {post.createdAt
                    ? formatDistanceToNow(new Date(post.createdAt))
                    : "now"}
                </button>
                <span>·</span>
                <p className="flex items-center gap-1">
                  <FaEarthEurope /> {post.privacy}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={handleToggle}
              className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <HiDotsHorizontal />
            </button>
            {isOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <CiBookmark size={17} /> Save post
                </button>
                {post.user._id === userData._id && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FaPen size={15} /> Update post
                    </button>
                    <button
                      onClick={() => {
                        deleteMutate();
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      <RiDeleteBinLine size={17} /> Delete post
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-2">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
                className="w-full min-h-25 p-3 border-2 border-blue-100 rounded-xl focus:border-blue-400 outline-none resize-none text-gray-800 bg-slate-50 transition-all"
                autoFocus
              />
              <div className="flex gap-2 justify-end pb-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedContent(post.body);
                  }}
                  className="px-4 py-1.5 text-xs font-bold rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateMutate()}
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            post.body && (
              <p className="text-gray-700 mb-4 text-md leading-relaxed">
                {post.body}
              </p>
            )
          )}
        </div>

        {post.image && (
          <div className="border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="group relative block w-full"
            >
              <img
                src={post.image}
                alt=""
                className="w-full max-h-137.5 object-cover"
              />
              <span className="absolute inset-0 cursor-pointer bg-black/0 transition group-hover:bg-black/10"></span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="bg-blue-500 p-1.5 rounded-full ring-2 ring-white flex items-center justify-center shadow-sm">
                <AiFillLike className="text-white text-[8px]" />
              </div>
              <div className="bg-red-500 p-1.5 rounded-full ring-2 ring-white flex items-center justify-center shadow-sm">
                <AiFillHeart className="text-white text-[8px]" />
              </div>
            </div>
            <button className="text-md text-gray-500 hover:text-blue-600 cursor-pointer decoration-1 hover:underline">
              {post.likesCount} likes
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <IoRepeatSharp /> {post.sharesCount} shares
            </span>
            <span className="text-sm font-medium text-gray-500">
              {post.commentsCount} comments
            </span>
            <Link
              to={`/postDetails/${post._id}`}
              className="text-sm font-medium cursor-pointer text-blue-600 hover:bg-blue-50 hover:rounded-md py-0.5 px-2"
            >
              view details
            </Link>
          </div>
        </div>

        <div className="flex justify-between py-1 text-gray-600 border-t border-t-gray-100">
          <button className="flex-1 py-2 hover:bg-gray-100 flex cursor-pointer justify-center items-center gap-2 transition-colors rounded-lg">
            <AiOutlineLike size={18} /> Like
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 py-2 hover:bg-gray-100 flex justify-center cursor-pointer items-center gap-2 transition-colors rounded-lg"
          >
            <FaRegCommentDots size={18} /> Comment
          </button>
          <button className="flex-1 py-2 hover:bg-gray-100 flex justify-center cursor-pointer items-center gap-2 transition-colors rounded-lg">
            <FaShare size={18} /> Share
          </button>
        </div>

        {showComments && <CommentDetails post={post} />}
        {!showComments && post.commentsCount !== 0 && (
          <CommentsPosts
            post={post}
            setShowComments={setShowComments}
            showComments={showComments}
          />
        )}
      </article>

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
            src={post.image}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
