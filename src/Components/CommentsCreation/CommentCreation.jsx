import React, { useContext, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuSendHorizontal } from "react-icons/lu";
import { FaImage, FaRegSmile } from "react-icons/fa";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TbLoader3 } from "react-icons/tb";
import { AuthContext } from "../../Context/AuthContext";

export default function CommentCreation({
  post,
  setShowEmojiPicker,
  emojiPickerRef,
  showEmojiPicker,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const query = useQueryClient();
  const { userData, setuserData } = useContext(AuthContext);

  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  const { register, handleSubmit, reset, setValue, watch } = form;
  const bodyValue = watch("body");

  const formData = new FormData();

  function createComment(formData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
        },
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getCommentsDetails", post._id] });
      query.invalidateQueries({ queryKey: ["getFeedPosts"] });
      reset();
      setImagePreview(null);
    },
  });

  function handlecreateComment(value) {
    if (!value.body && !value.image) return;

    const formData = new FormData();
    if (value.body) formData.append("content", value.body);
    if (value.image && value.image.length > 0) {
      formData.append("image", value.image[0]);
    }
    mutate(formData);
  }
  const handleEmojiClick = (emojiData) => {
    setValue("body", bodyValue + emojiData.emoji);
  };

  return (
    <>
      <div className="flex gap-3 items-start pt-2">
        <form
          className="w-full flex gap-3"
          onSubmit={handleSubmit(handlecreateComment)}
        >
          <img
            src={
              userData?.photo ||
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
            }
            className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
            alt="User Avatar"
          />

          <div className="flex-1 bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-100 transition-all">
            <input
              {...register("body")}
              type="text"
              placeholder={`Comment as ${userData.name}...`}
              className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />

            {imagePreview && (
              <div className="mt-3 relative w-fit">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-h-40 rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full px-2 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2 text-gray-400 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="image-comment"
                    className="hidden"
                    accept="image/*"
                    {...register("image", {
                      onChange: (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImagePreview(URL.createObjectURL(file));
                        }
                      },
                    })}
                  />
                  <label
                    htmlFor="image-comment"
                    className="flex items-center text-gray-500 hover:text-green-800 hover:bg-gray-200 cursor-pointer px-1.5 py-1.5 rounded-xl transition font-medium"
                  >
                    <FaImage size={17} />
                  </label>
                </div>

                <div className="relative" ref={emojiPickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center text-gray-500 hover:text-orange-400 hover:bg-gray-100 cursor-pointer p-2 rounded-full transition"
                  >
                    <FaRegSmile size={20} />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 mb-4 z-999 shadow-xl border border-gray-100 rounded-2xl custom-emoji-picker">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        autoFocusSearch={false}
                        searchPlaceholder="Search"
                        width={320}
                        height={450}
                        theme="light"
                        emojiStyle="facebook"
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled={true}
                        searchDisabled={false}
                        categories={[
                          { category: "suggested", name: "Frequently used" },
                          {
                            category: "smileys_people",
                            name: "Smileys & People",
                          },
                          {
                            category: "animals_nature",
                            name: "Animals & Nature",
                          },
                          { category: "food_drink", name: "Food & Drink" },
                          { category: "activities", name: "Activities" },
                          {
                            category: "travel_places",
                            name: "Travel & Places",
                          },
                          { category: "objects", name: "Objects" },
                          { category: "symbols", name: "Symbols" },
                          { category: "flags", name: "Flags" },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={isPending || (!bodyValue?.trim() && !imagePreview)}
                type="submit"
                className="bg-blue-600 cursor-pointer rounded-4xl p-2.5 text-white disabled:cursor-no-drop disabled:bg-blue-300 transition-colors"
              >
                {isPending ? (
                  <TbLoader3 className="animate-spin" />
                ) : (
                  <LuSendHorizontal />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
