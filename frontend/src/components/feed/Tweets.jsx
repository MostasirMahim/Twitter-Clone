/* eslint-disable react/prop-types */
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlinePoll } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CommentsModalStyle } from "../../utils/ModalStyles.js";
import Modal from "react-modal";
import CommentsModal from "./CommentsModal";
import { formatPostDate } from "../../utils/formatDate.js";
import toast from "react-hot-toast";

function Tweets({ post }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userposts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/likes/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "likeUnlike error");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    //this mutaion fetch to call updatedLikes func and return his data,
    //so on Success it got updatedLikes func(data) and it set post likes
    //	from iterate oldata(al post to this post)
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["likesposts"] });
      queryClient.invalidateQueries({ queryKey: ["repliesposts"] });
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };
  const createdPost = formatPostDate(post?.createdAt);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCommentClick = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };
  if (!post) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-3xl text-sky-400 italic font-mono">
        Loading.....
      </div>
    );
  }

  const postOwner = post?.user;
  const isMyPost = authUser._id === post.user._id;
  const isLiked = post.likes.includes(authUser._id);
  return (
    <div className="mx-2 my-2 ">
      <div className="flex flex-start w-full">
        <div
          onClick={() => navigate(`/profile/${postOwner.username}`)}
          className="flex-shrink-0"
        >
          <img
            src={postOwner.profileImg}
            alt="profileImg"
            className="rounded-full h-[40px] w-[40px] m-2 ml-2 cursor-pointer "
          />
        </div>
        <div className="flex-col border-b-[1px] border-gray-700 pb-2 w-full ml-2">
          <div className="flex justify-between items-center">
            <span
              className=" xs:flex xs:flex-col sm:flex sm:justify-start space-x-2 mt-2 "
              onClick={() => navigate(`/profile/${postOwner.username}`)}
            >
              <h1 className="cursor-pointer hover:text-sky-400">
                {postOwner.fullname}
              </h1>
             <div className="flex justify-start space-x-4">
             <h1 className="cursor-pointer xs:text-sky-400 hover:text-sky-400 italic">
                @{postOwner.username}
              </h1>
              <h1>{createdPost}</h1>
             </div>
            </span>
            {isMyPost && (
              <MdDelete
                onClick={handleDeletePost}
                className="h-5 w-5 text-gray-700 hover:text-sky-500 cursor-pointer"
              />
            )}
          </div>
          <div className="text-left my-2 flex flex-col">
            {post.text && (
              <div
                onClick={() => navigate(`/posts/${post._id}`)}
                className="my-2 xs:w-full md:w-[80%] md:max-w-[80%] h-auto overflow-hidden break-words cursor-pointer"
              >
                {post.text}
              </div>
            )}
            {post.img && (
              <img
                src={post.img}
                onClick={() => navigate(`/posts/${post._id}`)}
                className=" rounded-xl border-[1px] border-gray-700 xs:w-full md:w-[80%] h-[400px] object-contain"
              />
            )}
          </div>
          <span className="flex justify-between mt-4">
            <div className="flex space-x-1 items-center">
              <FaRegComment
                onClick={handleCommentClick}
                className=" text-sky-500 w-[20px] h-[20px] cursor-pointer hover:scale-110 hover:text-blue-600"
              />
              <p className=" text-gray-600">{post.comments.length}</p>
            </div>
            <BiRepost className="cursor-pointer hover:scale-110 text-sky-500 w-[25px] h-[25px] hover:text-blue-600" />
            <div className="flex space-x-1 items-center">
              {!isLiked && (
                <FaRegHeart
                  onClick={handleLikePost}
                  className=" text-sky-500 w-[20px] h-[20px] hover:text-blue-600 cursor-pointer hover:scale-110"
                />
              )}
              {isLiked && (
                <FaRegHeart
                  onClick={handleLikePost}
                  className=" cursor-pointer hover:scale-110 text-pink-500 w-[20px] h-[20px] hover:text-blue-600"
                />
              )}
              <p className=" text-gray-600">{post.likes.length}</p>
            </div>
            <MdOutlinePoll className="cursor-pointer hover:scale-110 text-sky-500 w-[20px] h-[20px] mr-2 hover:text-blue-600" />
          </span>
        </div>
      </div>

      <Modal
        className="md:w-full xs:w-2/3"
        isOpen={isModalVisible}
        onRequestClose={handleCloseModal}
        style={CommentsModalStyle}
      >
        <CommentsModal post={post} handleCloseModal={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default Tweets;
