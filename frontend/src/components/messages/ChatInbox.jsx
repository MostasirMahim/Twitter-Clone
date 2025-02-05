import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useSocket } from "./Socket";

import { BsSend } from "react-icons/bs";
import {
  MdOutlineAddPhotoAlternate,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";


import { ImagePlus } from "lucide-react";
import { RiDeleteBack2Line } from "react-icons/ri";
import useSendMessage from "./hooks/useSendMessage";
import useConversation from './hooks/useConversation';
import useChatPeople from "./hooks/useChatPeople";
import messageStore from "./messageStore";
import { extractTime } from "./extractDate";
import LoadingSpinner from "../feed/LoadingSpinner";
import Message from './Message';
import useChatOthers from "./hooks/useOthers";
function ChatInbox() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const { socket, onlineUsers } = useSocket();
  const sendMessage = useSendMessage();

  const { data: selectConversation, isLoading } = useConversation(id);
  const { data: chatPeoples, isLoading: chatLoading } = useChatPeople();
  const { data: chatOthers, isLoading: othersLoding } = useChatOthers();
  const opponent = chatPeoples?.find(
    (item) => item.opponent._id === id
  )?.opponent || chatOthers?.find((item) => item._id === id);

  const {
    conversationMessage,
    setConversationMessage,
    clearConversationMessage,
  } = messageStore();
  const isOnline = onlineUsers.includes(opponent?._id);
  const messageData = useFormik({
    initialValues: {
      receiverId: "",
      text: "",
      images: [],
    },
    onSubmit: async (values, { resetForm }) => {
      values.receiverId = id;
      sendMessage.mutate(values);
      resetForm();
    },
  });

  let lastOppentseen;
  if (opponent && selectConversation) {
    const lastOppentMessages = selectConversation?.messages?.filter(
      (message) => message.senderId.toString() == id
    );
   if(lastOppentMessages?.length > 0){
    lastOppentseen = extractTime(
      lastOppentMessages[lastOppentMessages?.length - 1]?.createdAt || ""
    );
   }
  } 

  useEffect(() => {
    if (selectConversation) {
      setConversationMessage(selectConversation.messages);
    }
    return () => clearConversationMessage();
  }, [selectConversation, id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      setConversationMessage(newMessage);
    });
    return () => socket.off("newMessage");
  }, [socket]);
  const mainRef = useRef(null);
  useEffect(() => {
    if (conversationMessage.length > 0) {
      const scrollContainer = mainRef.current;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversationMessage]);

  const imgUploader = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);

    const allowedExtensions = ["image/jpeg", "image/png", "image/jpg"];
    const MAX_SIZE_MB = 1;
    const MAX_FILES = 3;

    if (files.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    const validFiles = files.filter((file) => {
      const fileSize = file.size / (1024 * 1024);
      return allowedExtensions.includes(file.type) && fileSize <= MAX_SIZE_MB;
    });

    if (validFiles.length === 0) {
      alert("Some files have invalid formats. Only JPEG and PNG are allowed.");
      return;
    }

    if (validFiles.length > 0) {
      const images = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          images.push(reader.result);
          messageData.setFieldValue("images", images);
        };
        reader.onerror = () => {
          console.error(`Failed to read file: ${file.name}`);
        };

        reader.readAsDataURL(file);
      });

      if (imgRef.current) {
        imgRef.current.value = "";
      }
    }
  };

  const removeImage = (index) => {
    messageData.setFieldValue(
      "images",
      messageData.values.images.filter((_, i) => i !== index)
    );
  };
  console.log(opponent);
  if (isLoading || chatLoading || othersLoding) return <LoadingSpinner />;
  return (
    <div
      className="w-full flex flex-col h-full bg-black"
    >
      {/* Header Navbar */}

      <div className="w-full h-12 bg-[#12192C] flex xs:justify-start sm:justify-between items-center gap-3 p-2">
        <div onClick={() => navigate(-1)} >
          <MdOutlineKeyboardBackspace className="w-8 h-8 text-white cursor-pointer" />
        </div>
        <div className="flex justify-start items-center w-full gap-3 px-2">
          <div className={`h-8 w-8 avatar ${isOnline ? "online" : ""}`}>
            <img
              src={
                opponent?.profileImg ||
                "https://avatar.iran.liara.run/public/11"
              }
              alt=""
              className="rounded-full h-12 w-12 "
            />
          </div>
          <div>
            <p className="hover:text-blue-500 text-white font-Amaranth text-sm">
              {opponent?.fullname}
            </p>
            <div className="text-sm font-spartan text-[#20ff11] hover:text-blue-500">
              {isOnline ? (
                "Online"
              ) : (
                <p className="text-red-500">
                 { lastOppentseen ? `Last seen : ${lastOppentseen} ` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <main
        className="w-full  flex-1 overflow-y-auto scrollbar-none px-5"
        ref={mainRef}
      >
        {!selectConversation?.messages?.length ? (
          <div className="flex flex-col h-full  items-center justify-center">
            <p className="text-2xl font-kaushan ">No Messages Yet.💬</p>
          </div>
        ) :
        (conversationMessage && conversationMessage?.map((message, index) => (
          <Message key={index} message={message} />
        )))}
      </main>

      {/* Footer */}
      <div className="w-full h-12 bg-transparent flex justify-center items-center">
        <div className="xs:w-[90%] sm:w-2/3 max-h-10 relative bg-white  flex justify-center items-end rounded-lg cursor-default outline-none gap-1 ">
          <div className="h-10 flex items-center justify-cente border-r-[1px] border-blue-600">
            <ImagePlus
              onClick={() => document.getElementById("my_modal_IMG").show()}
              className="text-blue-600 w-10 h-9 p-1 cursor-pointer hover:text-green-400 hover:scale-110"
            />
          </div>

          <textarea
            type="text"
            placeholder="Say, Hi 👋......"
            rows="1"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                100
              )}px`;
              if (e.target.scrollHeight > 100) {
                e.target.style.overflowY = "auto";
              } else {
                e.target.style.overflowY = "hidden";
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.shiftKey) {
                  e.preventDefault();
                  messageData.handleSubmit();
                }
              }
            }}
            name="text"
            onChange={messageData.handleChange}
            value={messageData.values.text}
            className="bg-white text-black w-full min-h-10 rounded-lg cursor-text outline-none scrollbar-none resize-none p-2"
          />
          <div
            onClick={messageData.handleSubmit}
            className="h-10 flex items-center justify-cente border-l-[1px] border-blue-600"
          >
            <BsSend className="text-blue-600 w-10 h-9 p-1 cursor-pointer hover:text-green-400 hover:scale-110" />
          </div>
        </div>
      </div>

      <dialog id="my_modal_IMG" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={messageData.resetForm}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-semibold font-Amaranth text-left text-lg py-4">
            Add Image
          </h3>

          <section className="flex justify-start items-center gap-2">
            <div
              onClick={() => imgRef.current.click()}
              className="w-14 h-14 bg-slate-200 flex flex-center cursor-pointer hover:border-2 hover:border-sky-500 rounded-md hover:bg-slate-300 hover:duration-300"
            >
              <MdOutlineAddPhotoAlternate className="w-8 h-8" />
            </div>
            <input
              type="file"
              hidden
              ref={imgRef}
              multiple
              accept="image/png, image/jpeg"
              onChange={(e) => imgUploader(e)}
            />
            {messageData.values.images.map((image, index) => (
              <div
                key={index}
                className="relative w-14 h-14 bg-slate-200 flex flex-center border-2 border-blue-500"
              >
                <img src={image} alt={image} />
                <RiDeleteBack2Line
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 w-4 h-4 cursor-pointer text-gray-600"
                />
              </div>
            ))}
          </section>

          <div className="h-10 flex items-center justify-end  ">
            <button
              disabled={messageData.values.images.length == 0}
              onClick={messageData.handleSubmit}
              className="flex items-center gap-2 btn btn-sm btn-outline"
            >
              <p>SEND</p>
              <BsSend className=" w-5 h-5  cursor-pointer hover:text-green-400 hover:scale-110" />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ChatInbox;
