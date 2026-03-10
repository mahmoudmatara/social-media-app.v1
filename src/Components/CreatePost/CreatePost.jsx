import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaGlobeAmericas,
  FaImage,
  FaPaperPlane,
  FaRegSmile,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TbLoader3 } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";

export default function CreatePost() {
  const [textValue, setTextValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { userData, setuserData } = useContext(AuthContext);

  const query = useQueryClient();

  function dataPost() {
    const formData = new FormData();
    if (textValue.trim()) {
      formData.append("body", textValue);
    }
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    return formData;
  }

  function createPost() {
    return axios.post(`https://route-posts.routemisr.com/posts`, dataPost(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("UserToken")} `,
      },
    });
  }

  const { isPending, isError, mutate, reset } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      console.log("done");
      toast.success("تم النشر بنجاح! 🎉");
      setTextValue("");
      handleRemoveImage();
      query.invalidateQueries({ queryKey: ["getFeedPosts"] });
      reset();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "عذراً، حدث خطأ غير متوقع";
      toast.error(message);
      console.error(error);
    },
  });

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(URL.createObjectURL(selectedImage));
    }
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onEmojiClick = (emojiObject) => {
    setTextValue((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="col-span-6 xl:col-span-6 space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[#f3f4f6] rounded-3xl shadow-md border border-gray-200 max-w-3xl min-w-full p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={
              userData?.photo ||
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
            }
            className="w-14 h-14 rounded-full border border-gray-200 shadow-sm"
            alt="User Avatar"
          />
          <div>
            <p className="font-bold text-gray-800 text-lg leading-none">
              {userData?.name || "Guest"}
            </p>
            <div className="mt-2">
              <div className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 w-fit">
                <FaGlobeAmericas size={12} />
                <select className="bg-transparent outline-none cursor-pointer">
                  <option value="public">Public</option>
                  <option value="followers">Followers</option>
                  <option value="only_me">Only me</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <textarea
            placeholder={`What's on your mind, ${userData?.name || "Guest"}?`}
            value={textValue}
            className="w-full min-h-30 bg-white rounded-2xl border border-gray-200 p-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 transition-colors duration-200 resize-none"
            onChange={(e) => setTextValue(e.target.value)}
          />

          {selectedImage && (
            <div className="relative mt-2 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/90 transition z-10"
              >
                <span className="text-sm">✕</span>
              </button>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected preview"
                className="w-full h-auto max-h-80 object-cover rounded-xl"
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 md:gap-6">
            <input
              type="file"
              id="image-upload"
              ref={fileInputRef}
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setSelectedImage(file);
              }}
            />
            <label
              htmlFor="image-upload"
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-xl cursor-pointer transition"
            >
              <FaImage className="text-green-500" size={18} />
              <span className="font-medium">Photo/video</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-xl transition"
              >
                <FaRegSmile className="text-orange-400" size={18} />
                <span className="font-medium">Feeling/activity</span>
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute top-full left-0 mb-2 z-50 shadow-2xl"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isPending || (!textValue.trim() && !selectedImage)}
            className={`px-8 py-2 cursor-pointer rounded-xl flex items-center gap-2 font-bold shadow-md transition-all ${
              isPending
                ? "bg-blue-300 text-white cursor-wait opacity-80"
                : textValue.trim() || selectedImage
                ? "bg-blue-500 hover:bg-blue-600 text-white active:scale-95"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
          >
            {isPending ? (
              <>
                <TbLoader3 className="animate-spin" size={20} />
                <span>Posting...</span>
              </>
            ) : (
              <>
                Post <FaPaperPlane size={14} />
              </>
            )}
          </button>
        </div>
      </div>
      {isError && (
        <p className="text-xs text-red-500 mt-1 ml-2 font-medium">
          * فشل الإرسال، تأكد من اتصالك بالإنترنت.
        </p>
      )}
    </main>
  );
}
