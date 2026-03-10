import React, { useState, useEffect, useRef, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaTimes, FaPen } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuMessageCircle } from "react-icons/lu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import CommentCreation from "./../CommentsCreation/CommentCreation";

export default function CommentDetails({ post }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textValue, setTextValue] = useState("");
  const emojiPickerRef = useRef(null);
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getCommentsDetails", post._id],
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/posts/${post._id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        }
      ),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (!event.target.closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData) => {
    setTextValue((prev) => prev + emojiData.emoji);
  };

  const { mutate: deleteCommentMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id) =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${post._id}/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        }
      ),
    onSuccess: () => {
      toast.success("Comment deleted 🗑️");
      queryClient.invalidateQueries({
        queryKey: ["getCommentsDetails", post._id],
      });
      queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
      setCommentToDelete(null);
    },
    onError: () => toast.error("Can't delete comment"),
  });

  const { mutate: updateCommentMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ commentId, content }) => {
      const formData = new FormData();
      formData.append("content", content);
      return axios.put(
        `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Comment updated ✏️");
      queryClient.invalidateQueries({
        queryKey: ["getCommentsDetails", post._id],
      });
      queryClient.invalidateQueries({ queryKey: ["getFeedPosts"] });
      setEditingCommentId(null);
    },
    onError: () => toast.error("Update failed"),
  });

  if (isError) return <h1>{error.message}</h1>;
  const commentsDet = data?.data.data.comments || [];

  return (
    <div className="mt-4 space-y-4 border-t border-t-gray-200 p-4">
      <div className="flex items-center justify-between py-3 rounded-2xl px-2 border-2 border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 text-sm">Comments</span>
          <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {post.commentsCount}
          </span>
        </div>
        <select className="text-xs font-semibold text-gray-600 bg-gray-50 border-none outline-none cursor-pointer p-1 rounded">
          <option>Most relevant</option>
          <option>Newest</option>
        </select>
      </div>

      {post.commentsCount === 0 ? (
        <div className="space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff] text-[#1877f2]">
              <LuMessageCircle size={22} strokeWidth={2} aria-hidden="true" />
            </div>

            <p className="text-lg font-extrabold text-slate-800">
              No comments yet
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Be the first to comment.
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="p-8 text-center text-sm text-slate-500 border border-slate-300 rounded-2xl">
          Loading comments...
        </div>
      ) : (
        <div className="space-y-6">
          {commentsDet.map((comment) => (
            <div
              key={comment._id}
              className="relative flex items-start gap-2 group"
            >
              <img
                src={comment.commentCreator.photo}
                alt={comment.commentCreator.name}
                className="mt-0.5 h-10 w-10 rounded-full object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <div className="min-w-37.5 max-w-full rounded-2xl bg-[#f0f2f5] px-4 py-2 transition-all">
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {comment.commentCreator.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mb-2">
                      @{comment.commentCreator.username} .{" "}
                      {formatDistanceToNow(new Date(comment.createdAt))
                        .replace("about ", "")
                        .replace("less than a minute", "now")
                        .replace(" minutes", "m")
                        .replace(" minute", "m")
                        .replace(" hours", "h")
                        .replace(" hour", "h")
                        .replace(" days", "d")
                        .replace(" day", "d")
                        .replace(" months", "mo")
                        .replace(" month", "mo")
                        .replace(" years", "y")
                        .replace(" year", "y")}
                    </p>

                    {editingCommentId === comment._id ? (
                      <div className="flex items-center gap-2 pb-1">
                        <input
                          value={updatedComment}
                          onChange={(e) => setUpdatedComment(e.target.value)}
                          disabled={isUpdating}
                          className={`flex-1 min-w-37.5 px-4 py-1.5 text-sm border rounded-full outline-none bg-white shadow-inner transition-all ${
                            isUpdating
                              ? "border-gray-100 opacity-50"
                              : "border-gray-300 focus:border-blue-500"
                          }`}
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            !isUpdating &&
                            updateCommentMutate({
                              commentId: comment._id,
                              content: updatedComment,
                            })
                          }
                        />
                        <button
                          onClick={() =>
                            updateCommentMutate({
                              commentId: comment._id,
                              content: updatedComment,
                            })
                          }
                          disabled={isUpdating}
                          className="bg-[#1877f2] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isUpdating ? (
                            <>
                              <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                        {!isUpdating && (
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-800 wrap-break-word leading-relaxed">
                        {comment.content && <p>{comment.content}</p>}
                        {comment.image && (
                          <img
                            src={comment.image}
                            onClick={() => setSelectedImg(comment.image)}
                            className="mt-2 max-h-60 rounded-lg cursor-pointer hover:opacity-95 transition"
                            alt="comment"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {(comment.commentCreator._id === userData._id ||
                    post.user._id === userData._id) &&
                    editingCommentId !== comment._id && (
                      <div className="relative menu-container self-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === comment._id ? null : comment._id
                            );
                          }}
                          className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          <HiDotsHorizontal size={18} />
                        </button>

                        {openMenuId === comment._id && (
                          <div className="absolute left-0 mt-1 z-30 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                            {comment.commentCreator._id === userData._id && (
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment._id);
                                  setUpdatedComment(comment.content);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                <FaPen size={10} /> Edit
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setCommentToDelete(comment._id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <RiDeleteBinLine size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                <div className="mt-1 flex items-center gap-4 px-2 text-[12px] font-bold text-slate-500">
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt))
                      .replace("about ", "")
                      .replace("less than a minute", "now")
                      .replace(" minutes", "m")
                      .replace(" minute", "m")
                      .replace(" hours", "h")
                      .replace(" hour", "h")
                      .replace(" days", "d")
                      .replace(" day", "d")
                      .replace(" months", "mo")
                      .replace(" month", "mo")
                      .replace(" years", "y")
                      .replace(" year", "y")}
                  </span>
                  <button className="hover:underline">
                    Like ({comment.likes?.length || 0})
                  </button>
                  <button className="hover:underline">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CommentCreation
        post={post}
        setShowEmojiPicker={setShowEmojiPicker}
        showEmojiPicker={showEmojiPicker}
        emojiPickerRef={emojiPickerRef}
        onEmojiClick={onEmojiClick}
      />

      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-2000 flex items-center justify-center bg-black/90 p-4"
        >
          <button className="absolute right-4 top-4 text-white">
            <FaTimes size={20} />
          </button>
          <img
            src={selectedImg}
            className="max-h-full max-w-full object-contain"
            alt="preview"
          />
        </div>
      )}

      {commentToDelete && (
        <div className="fixed inset-0 z-3000 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-130 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h4 className="text-base font-extrabold text-slate-900">
                Confirm action
              </h4>
              <button
                onClick={() => setCommentToDelete(null)}
                type="button"
                className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="flex items-start gap-3 p-4">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <IoWarningOutline size={19} />
              </div>
              <div>
                <h5 className="text-sm font-extrabold text-slate-900">
                  Delete this comment?
                </h5>
                <p className="mt-1 text-sm text-slate-600">
                  This comment will be permanently removed.
                </p>
              </div>
            </div>


            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <button
                onClick={() => setCommentToDelete(null)}
                type="button"
                disabled={isDeleting} 
                className={`rounded-lg border cursor-pointer border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </button>

              <button
                onClick={() => deleteCommentMutate(commentToDelete)}
                type="button"
                disabled={isDeleting} 
                className="rounded-lg cursor-pointer bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete comment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
