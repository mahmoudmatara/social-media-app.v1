import React from "react";
import axios from "axios";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import PostsCard from "./../PostsCard/PostsCard";
import { useQuery } from "@tanstack/react-query";

export default function PostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("UserToken")}` },
    });
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getpostDetails", id],
    queryFn: getPostDetails,
    enabled: !!id,
  });
  const post = data?.data?.data?.post;

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center cursor-pointer gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm"
        >
          <HiArrowLeft className="text-lg" />
          <span>Back</span>
        </button>
        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            Loading post...
          </div>
        )}
        {!isLoading && post && <PostsCard post={post} />}
      </div>
    </>
  );
}
