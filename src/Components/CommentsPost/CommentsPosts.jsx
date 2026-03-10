import React from "react";

export default function CommentsPosts({ post, showComments, setShowComments }) {
  return (
    <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-gray-500 font-bold text-xs">Top Comment</p>
      <div className="flex items-center gap-2 py-2">
        <img
          src={post.topComment.commentCreator.photo}
          className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
          alt="User Avatar"
        />
        <div>
          <p className="text-gray-700 font-bold py-1 text-sm">
            {post.topComment.commentCreator.name}
          </p>
          <p className="text-gray-700">{post.topComment.content}</p>
        </div>
      </div>
      <button
        onClick={() => {
          setShowComments((prev) => !prev);
        }}
        className="mt-2 text-xs font-bold text-[#1877f2] hover:underline cursor-pointer"
      >
        View all comments
      </button>
    </div>
  );
}
