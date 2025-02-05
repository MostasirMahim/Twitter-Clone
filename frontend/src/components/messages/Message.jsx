import { useQuery } from "@tanstack/react-query";
import { extarctDate } from "./extractDate";
import useChatOthers from "./hooks/useOthers";
import LoadingSpinner from "../feed/LoadingSpinner";

function Message({ message }) {
  const { data: user } = useQuery({ queryKey: ["authUser"] });
  const { data: chatOthers, isLoading: othersLoding } = useChatOthers();
  const opponent = chatOthers?.find(
    (other) =>
      other?._id ==
      (message?.senderId == user?._id ? message?.receiverId : message?.senderId)
  );
  const fromMe = message?.senderId === user?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? user.profileImg : opponent?.profileImg;
  const messageTime = extarctDate(message?.createdAt);

  function getDownloadLink(cloudinaryUrl) {
    const urlParts = cloudinaryUrl.split("/");

    if (urlParts.length >= 8) {
      urlParts.splice(-2, 0, "fl_attachment");
      return urlParts.join("/");
    }
    return cloudinaryUrl;
  }
  const downloadImage = (imageUrl) => {
    const downloadLink = getDownloadLink(imageUrl);
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  if (othersLoding) return <LoadingSpinner />;
  return (
    <div className={`chat ${chatClassName} w-full`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src={profilePic || "https://avatar.iran.liara.run/public/11"}
            alt=""
          />
        </div>
      </div>
      {message?.text && message?.images?.length > 0 ? (
        <div
          className={`flex flex-col ${fromMe ? "items-end" : "items-start"}`}
        >
          {message.images.map((img, index) => (
            <img
              key={index}
              onDoubleClick={() => downloadImage(img)}
              src={img}
              alt=""
              className="w-[120px] h-[150px] object-contain border-[1px] my-1 rounded-lg border-gray-700 "
            />
          ))}
          <div className={`chat-bubble text-white text-lg bg-sky-500 `}>
            {message?.text}
          </div>
          <div
            className={`chat-footer opacity-50 text-xs flex gap-1 ${
              fromMe ? "justify-end" : "justify-start"
            } items-center`}
          >
            {messageTime}
          </div>{" "}
        </div>
      ) : message?.images?.length == 0 ? (
        <div>
          <div className="chat-bubble text-white text-lg bg-sky-500 font-spartan ">
            {message?.text}
          </div>
          <div
            className={`chat-footer opacity-50 text-xs flex gap-1 ${
              fromMe ? "justify-end" : "justify-start"
            } items-center`}
          >
            {messageTime}
          </div>{" "}
        </div>
      ) : (
        <div
          className={`flex flex-col ${fromMe ? "items-end" : "items-start"}`}
        >
          {message?.images?.map((img, index) => (
            <img
              key={index}
              onDoubleClick={() => downloadImage(img)}
              src={img}
              alt=""
              className="w-[120px] h-[150px] object-contain border-[1px] my-1 rounded-lg border-gray-700 "
            />
          ))}
          <div
            className={`chat-footer opacity-50 text-xs flex gap-1 ${
              fromMe ? "justify-end" : "justify-start"
            } items-center`}
          >
            {messageTime}
          </div>{" "}
        </div>
      )}
    </div>
  );
}

export default Message;
