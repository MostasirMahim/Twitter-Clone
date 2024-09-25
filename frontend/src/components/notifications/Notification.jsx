import { IoSettingsOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaComment } from "react-icons/fa6";
import { SlUserFollowing } from "react-icons/sl";

import Modal from "react-modal";
import { useState } from "react";
import { deleteModalStyle } from "../../utils/ModalStyles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Notification() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: Notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/notifications`, {
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
      toast.success("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleUpdateClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (!Notifications) return null;
  return (
    <div>
      <div className="flex justify-center text-center xs:border-r-[1px] xs:border-gray-700 sm:border-none">
        <div className="w-full ">
          <div className="flex justify-between mx-4 my-2 items-center text-xl font-bold">
            <p>Notifications</p>
            <IoSettingsOutline
              onClick={handleUpdateClick}
              className="hover: cursor-pointer hover:text-sky-600  hover:rounded-full hover:border-gray-600 h-8 w-8 p-[6px] hover:bg-gray-600/50 hover:backdrop-blur-md"
            />
          </div>
          <div>
            <ul className="relative flex justify-around w-full h-[55px] font-bold border-b-[1px] border-gray-700">
              <li
                onClick={() => setActiveTab("all")}
                className="w-1/3 hover:bg-slate-800 h-full  flex justify-center items-center "
              >
                All
                {activeTab == "all" && (
                  <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
                )}
              </li>
              <li
                onClick={() => setActiveTab("verified")}
                className="w-1/3 hover:bg-slate-800 h-full flex justify-center  items-center"
              >
                Verified
                {activeTab == "verified" && (
                  <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
                )}
              </li>
              <li
                onClick={() => setActiveTab("mentions")}
                className="w-1/3 hover:bg-slate-800 h-full flex justify-center items-center"
              >
                Mentions
                {activeTab == "mentions" && (
                  <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
                )}
              </li>
            </ul>
          </div>
          {Notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex justify-start items-start space-x-4 p-4 pb-2 border-b-[1px] border-gray-700 "
            >
              <div>
                {notification.type == "like" && (
                  <FaHeart className="w-6 h-6 text-pink-600" />
                )}
                {notification.type == "comment" && (
                  <FaComment className="w-6 h-6 text-sky-400" />
                )}
                {notification.type == "follow" && (
                  <SlUserFollowing className="w-6 h-6 text-green-400" />
                )}
              </div>
              <div>
                <img
                  onClick={() => {
                    navigate(`/profile/${notification.from.username}`);
                  }}
                  src={notification.from.profileImg}
                  alt="fromUser"
                  className="h-8 w-8 mb-2 border rounded-full"
                />
                <p>
                  <span
                    onClick={() => {
                      navigate(`/profile/${notification.from.username}`);
                    }}
                    className="font-bold"
                  >
                    @{`${notification.from.username} `}
                  </span>
                  <span>{`${notification.type} `}</span>
                  {notification.type == "like" && (
                    <span>
                      {" "}
                      your{" "}
                      <span
                        onClick={() => {
                          navigate(`/posts/${notification.content._id}`);
                        }}
                        className="text-sky-400 cursor-pointer"
                      >
                        post
                      </span>
                    </span>
                  )}
                  {notification.type == "follow" && <span>you</span>}
                  {notification.type == "comment" && (
                    <span>
                      on your{" "}
                      <span
                        onClick={() => {
                          navigate(`/posts/${notification.content._id}`);
                        }}
                        className="text-sky-400 cursor-pointer"
                      >
                        post
                      </span>
                    </span>
                  )}
                </p>

                {notification.type == "comment" && (
                  <p className="text-gray-700 flex justify-start mt-2 font-semibold">
                    {notification.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalVisible}
        onRequestClose={handleCloseModal}
        style={deleteModalStyle}
      >
        <div
          onClick={() => deleteNotification()}
          className="flex justify-start items-center space-x-3 ml-4 mt-2 hover:scale-110 cursor-pointer"
        >
          <MdDelete className="white w-6 h-6" />
          <p>Delete all Notifications</p>
        </div>
      </Modal>
    </div>
  );
}

export default Notification;
