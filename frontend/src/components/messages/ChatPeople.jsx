import { useNavigate } from "react-router-dom";
import { useSocket } from "./Socket";
import { extractConversationTime } from "./extractDate.js";

function ChatPeople({ data }) {
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();
  const isOnline = onlineUsers.includes(data?.opponent?._id);
  //OPPONENT PROFILEIMG
  return (
    <div
      className={` pl-4 flex justify-start items-center  space-x-3 py-1  border-b-[1px] cursor-pointer border-[#556269] `}
      onClick={() => {
        navigate(`/conversation/${data?.opponent?._id}`);
      }}
    >
      <div
        className={`h-12 w-14 avatar ${
          isOnline ? "online" : ""
        } border-[2px] border-sky-500 rounded-full`}
      >
        <img
          src={
            data?.opponent?.profileImg ||
            "https://avatar.iran.liara.run/public/11"
          }
          alt=""
          className="object-cover rounded-full"
        />
      </div>
      <div className=" flex justify-between items-center pb-2 w-full ">
        <div>
          <p className="text-md font-Amaranth">{data?.opponent?.fullname}</p>
          <p className=" text-xs font-quicksand font-bold">
            {data?.text || "Send messages"}
          </p>
        </div>
        <div>
          <p className="pr-4 text-sm font-spartan">
            {extractConversationTime(data?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPeople;
