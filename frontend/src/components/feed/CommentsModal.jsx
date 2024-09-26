/* eslint-disable react/prop-types */
import { CiImageOn } from "react-icons/ci";
import { MdOutlineGifBox } from "react-icons/md";
import { BiPoll } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

function CommentsModal({ handleCloseModal, post }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [comment, setComment] = useState("");
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }), //not understand clearly
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "commented error");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
    handleCloseModal();
    toast.success("Comment Successfully");
  };
  if (isCommenting) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <AiOutlineLoading3Quarters className="animate-spin text-sky-500 w-1/5 h-1/5" />
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <div className=" flex flex-col justify-between h-full">
        <div>
          <GiCancel
            className="ml-auto hover:cursor-pointer hover:text-sky-500"
            onClick={handleCloseModal}
          />
          <div onClick={()=> navigate(`/profile/${post.user.username}`)} className=" flex justify-start items-center space-x-2 mt-2 ">
            <img
              src={post.user.profileImg}
              alt="profileImg"
              className=" cursor-pointer rounded-full h-[40px] w-[40px] m-2 ml-2"
            />

            <h1 className="cursor-pointer hover:text-sky-400">{post.user.fullname}</h1>
            <h1 className="cursor-pointer hover:text-sky-400">{post.user.username}</h1>
            <h1>{formatPostDate(post.createdAt)}</h1>
          </div>
          <div className="text-left pl-16 space-y-2">
            <p>{post.text}</p>
            <p>
              Replying to{" "}
              <span className="text-sky-400">@{post.user.username}</span>
            </p>
          </div>

          <div className="space-y-1 bg-gray-900 my-2">
            <hr />
            <hr />
          </div>

          <div className=" flex justify-start items-start space-x-2 my-2 ">
            <img
              src={authUser.profileImg}
              alt="profileImg"
              className="rounded-full h-[40px] w-[40px] m-2 ml-2 "
            />
            <textarea
              name="comment"
              rows="1"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comments Here..."
              id="textbox"
              onInput={(e) => {
                e.target.style.height = "auto"; // Reset the height
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
              }}
              className="bg-black text-white-600  rounded-lg p-2 focus:outline-none   text-lg w-full leading-tight placeholder-gray-500 resize-none overflow-hidden"
            ></textarea>
          </div>
        </div>

        <div className=" flex justify-between  px-4 py-2">
          <div className="flex justify-start items-center space-x-3">
            <CiImageOn className=" fill-blue-400 w-6 h-6" />
            <MdOutlineGifBox className=" fill-blue-400 w-6 h-6" />
            <BiPoll className=" fill-blue-400 w-6 h-6" />
            <BsEmojiSmile className=" fill-blue-400 w-6 h-6" />
            <RiCalendarScheduleFill className=" fill-blue-400 w-6 h-6" />
          </div>
          <div
            onClick={handlePostComment}
            className=" w-16 h-8 bg-sky-400 rounded-full flex items-center justify-center font-semibold mr-5 cursor-pointer hover:bg-blue-600 "
          >
            Post
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsModal;
