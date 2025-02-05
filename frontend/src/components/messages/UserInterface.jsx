import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { IoChatbubblesOutline } from "react-icons/io5";

import ChatPeople from "./ChatPeople";
import LoadingSpinner from "../feed/LoadingSpinner";
import useChatPeople from "./hooks/useChatPeople";
import useChatOthers from "./hooks/useOthers";

function UserInterface() {
  const hasOutlet = useOutlet();
  const navigate = useNavigate();
  const { data: chatPeoples, isLoading } = useChatPeople();
  const { data: chatOthers, isLoading: othersLoding } = useChatOthers();

  if (isLoading || othersLoding) return <LoadingSpinner />;
  console.log(chatPeoples, chatOthers);
  return (
    <div className="w-full min-h-screen px-5 pt-2 flex justify-end items-start overflow-hidden bg-black rounded-xl">
      {/* Left Side Panel Section */}
      <section
        className={`${
          !hasOutlet ? "w-full" : "hidden"
        }   border-[#12192C] rounded-l-xl min-h-[calc(100vh-20px)] h-[calc(100vh-20px)] bg-black text-white transition-all duration-500 ease-in-out `}
      >
        <div className="p-3 h-12 bg-[#12192C] flex justify-between items-center">
          <p className="text-2xl font-semibold font-kaushan text-white">
            Message
          </p>
          <IoChatbubblesOutline className="text-3xl text-white" />
        </div>

        <div className="w-full h-full overflow-y-auto scrollbar-none ">
          {chatPeoples && chatPeoples?.length ? (
            chatPeoples?.map((item) => (
              <ChatPeople key={item._id} data={item} />
            ))
          ) : (
            <div className="w-full flex flex-col justify-center items-center overflow-hidden">
              {/* No Chats Message - Takes Half Height */}
              <div className="flex-[0.3] my-5 w-full h-full flex flex-col items-center justify-center ">
                <p className="text-2xl  font-semibold font-Amaranth text-[#12192C]">
                  No Chats
                </p>
                <p className="text-lg font-semibold font-Amaranth text-[#12192C]">
                  Start a conversation
                </p>
              </div>

              {/* Chat List - Takes Other Half */}
              <div className="flex-[0.7] w-full  max-h-[400px] overflow-y-auto scrollbar-thin">
                {chatOthers &&
                  chatOthers.length > 0 &&
                  chatOthers.map((item, index) => (
                    <div
                      key={index}
                      className={` pl-4 flex justify-start items-center  space-x-3 py-1  border-b-[1px] cursor-pointer border-[#556269] `}
                      onClick={() => {
                        navigate(`/conversation/${item?._id}`);
                      }}
                    >
                      <div className={``}>
                        <img
                          src={
                            item?.profileImg ||
                            "https://avatar.iran.liara.run/public/11"
                          }
                          alt=""
                          className="object-cover h-12 w-12  border-[2px] border-sky-500 rounded-full "
                        />
                      </div>
                      <div className=" flex justify-between items-center pb-2 w-full ">
                        <div>
                          <p className="text-black text-md font-Amaranth">
                            {item?.fullname}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <section
        className={`${
          hasOutlet ? "w-full" : "hidden "
        }  bg-[#12192C] rounded-r-xl overflow-hidden transition-all duration-1000 ease-in-out border-2 border-[#12192C] min-h-[calc(100vh-20px)] h-[calc(100vh-20px)]`}
      >
        {hasOutlet ? (
          <Outlet />
        ) : (
          <div className=" text-white ">
            <div className="flex justify-center items-center sm:pt-20">
              <SiGooglemessages className="text-6xl text-[#03ddff]" />
            </div>
            <p className="text-center text-4xl font-semibold font-kaushan pt-2">
              Welcome to MahimX
            </p>
            <p className=" text-center text-sm font-semibold font-nunito pt-1">
              Your Personal Social Media Platform
            </p>
            <div className="xs:w-full sm:max-w-[80%] flex justify-center items-center gap-2 mx-auto mt-10">
              <div className="w-1/3 h-32 space-y-2 rounded-xl p-1 ">
                <p className="text-center font-semibold font-kaushan text-sm">
                  Fastest Connetion
                </p>
                <p className="xs:h-[180px] xl:h-20 text-center text-sm bg-black p-2 py-4 font-spartan overflow-y-scroll scrollbar-none">
                  &quot;Fast, reliable delivery with order tracking at your
                  fingertips.&quot;
                </p>
              </div>
              <div className="w-1/3 h-32 space-y-2 rounded-xl p-1">
                <p className="text-center font-semibold font-kaushan text-sm">
                  Secure Activity
                </p>
                <p className="xs:h-[180px] xl:h-20 text-center text-sm bg-black p-2 py-4 font-spartan overflow-y-scroll scrollbar-none">
                  &quot;Seamless checkout experience with multiple cultural
                  options!&quot;
                </p>
              </div>
              <div className="w-1/3 h-32 space-y-2 rounded-xl p-1">
                <p className="text-center  font-semibold font-kaushan text-sm">
                  Get Your Needs
                </p>
                <p className="xs:h-[180px] xl:h-20 text-center text-sm bg-black p-2 py-4 font-spartan overflow-y-scroll scrollbar-none">
                  &quot;Personalized product recommendations based on your
                  browsing history&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserInterface;
