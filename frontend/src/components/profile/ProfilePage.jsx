import { MdKeyboardBackspace } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import Modal from "react-modal";
import EditProfileModel from "./EditProfileModel";
import { profileModalStyle } from "../../utils/ModalStyles";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import PostsP from "./PostsP";
import RepliesP from "./RepliesP";
import LikessP from "./LikessP";
import { formatMemberSinceDate } from "../../utils/formatDate.js";
import FollowButton from "../../hooks/FollowButton.jsx";
import LoadingSpinner from "../feed/LoadingSpinner.jsx";
import NotFound from "../feed/NotFound.jsx";

function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: usernameSearch, error } = useQuery({
    queryKey: ["usernameSearch", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/user/${username}`);
        const data = await res.json();
        if (!res.ok) return data.error;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user", usernameSearch],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${usernameSearch._id}`);
        const data = await res.json();
        if (!res.ok) return data.error;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleUpdateClick = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  const joinedMemberDate = formatMemberSinceDate(user?.createdAt);
  const isMyProfile = user?._id === authUser._id;

  if (error) {
    return <NotFound />;
  }
  if (isLoading || isFetching || !usernameSearch) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="sticky top-0 h-10 z-10 bg-black/50 backdrop-blur-lg ">
        <div className="flex m-2 space-x-4 items-center pt-1">
          <div>
            <MdKeyboardBackspace
              onClick={handleGoBack}
              className="w-8 h-8 cursor-pointer hover:scale-110 hover:text-sky-500"
            />
          </div>
          <h1 className="font-semibold text-lg font-sans">{user.fullname}</h1>
        </div>
      </div>

      <div className="relative bg-transparent">
        <img
          src={user.coverImg}
          alt="coverImg"
          className="w-full h-[200px] object-cover "
        />

        <img
          src={user.profileImg}
          alt="profileImg"
          className="w-36 h-36 object-cover rounded-full absolute  bottom-0 left-4 transform  translate-y-1/2 border-4 border-black"
        />

        {isMyProfile ? (
          <button
            type="button"
            onClick={handleUpdateClick}
            className="w-32 h-8 rounded-full absolute -bottom-12 right-6 border-2 border-slate-200 hover:text-sky-500 hover:border-sky-400"
          >
            Edit Profile
          </button>
        ) : (
          <div className="absolute -bottom-12 right-6">
            <FollowButton user={user} />{" "}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start mt-20 ml-6">
        <h1 className="font-bold text-center text-xl">{user.fullname}</h1>
        <h2 className="text-start text-slate-500 text-sm">@{user.username}</h2>
      </div>
      <div className="flex gap-2 items-center ml-6 mt-6 text-slate-600">
        <FaCalendarAlt />
        <h1>{joinedMemberDate}</h1>
      </div>
      <div className="flex space-x-4 ml-6 mt-2 text-gray-600 text-sm">
        <div
          onClick={() => {
            navigate("/sugessted/following");
          }}
          className="flex space-x-1 hover:underline hover:text-white"
        >
          <h1 className="text-white">{user.following.length}</h1>
          <h1>Following</h1>
        </div>
        <div
          onClick={() => {
            navigate("/sugessted/followers");
          }}
          className="flex space-x-1 hover:underline hover:text-white"
        >
          <h1 className="text-white">{user.followers.length}</h1>
          <h1>Follower</h1>
        </div>
      </div>
      <div className="mt-4">
        <ul className="flex justify-around items-center w-full h-12  border-b-2 border-gray-800 relative">
          <li
            className="hover:bg-gray-600 w-[33%] h-full flex justify-center items-center"
            onClick={() => setActiveTab("posts")}
          >
            Posts
            {activeTab === "posts" && (
              <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
            )}
          </li>
          <li
            className="hover:bg-gray-600 w-[33%] h-full flex justify-center items-center"
            onClick={() => setActiveTab("replies")}
          >
            Replies
            {activeTab === "replies" && (
              <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
            )}
          </li>
          <li
            className="hover:bg-gray-600 w-[33%] h-full flex justify-center items-center"
            onClick={() => setActiveTab("likes")}
          >
            Likes
            {activeTab === "likes" && (
              <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
            )}
          </li>
        </ul>
      </div>
      <div>
        {activeTab === "posts" && <PostsP key={user._id} id={user._id} />}
        {activeTab === "replies" && <RepliesP key={user._id} id={user._id} />}
        {activeTab === "likes" && <LikessP key={user._id} id={user._id} />}
      </div>

      <Modal
        isOpen={isModalVisible}
        onRequestClose={handleCloseModal}
        style={profileModalStyle}
        className="overflow-y-auto overflow-x-hidden scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        <EditProfileModel
          key={user._id}
          user={user}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default ProfilePage;
