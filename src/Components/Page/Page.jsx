import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loading from "./../Loading/Loading";
import PostsCard from "./../PostsCard/PostsCard";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function Page() {
  function getFeedPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/feed?only=following`,
      {
        // params :{sortt :"-createdAt"},
        headers: {
          Authorization: `Bearer ${localStorage.getItem("UserToken")} `,
        },
      }
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getFeedPosts"],
    queryFn: getFeedPosts,
  });

  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        {error.message}
      </div>
    );
  }
  // console.log(data?.data.data.posts);

  return (
    <>
      <div className="space-y-6">
        {isLoading ? (
          <>
            <Loading />
            <Loading />
          </>
        ) : data?.data?.data?.posts?.length === 0 ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <HiOutlineDocumentText size={22} />
              </div>
              <p className="text-sm">
                No posts yet. Be the first one to publish.
              </p>
            </div>
          </div>
        ) : (
          data?.data?.data?.posts?.map((post) => (
            <PostsCard key={post._id} post={post} />
          ))
        )}
      </div>
    </>
  );
}
