import { BsTwitterX } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

function LeftSideBar() {
  const naviagte = useNavigate();
  const [logicon, setLogicon] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: logOut } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/auth/logout`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Log Out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  const handleLogOut = () => {
    logOut();
  };
  return (
    <div className="w-[15%] max-h-screen sticky top-0 border-r-[1px] border-gray-700">
      <div className=" flex justify-end ">
        <div className="grid justify-items-center">
          <BsTwitterX
            onClick={() => naviagte("/feed")}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <GoHomeFill
            onClick={() => naviagte("/feed")}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <IoNotificationsOutline
            onClick={() => naviagte("/notification")}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <IoSearchOutline className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110" />
          <HiOutlineMail className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110" />
          <HiUsers
            onClick={() => naviagte("/sugessted/discover")}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <FaRegUser
            onClick={() => naviagte(`/profile/${authUser.username}`)}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <CgMoreO className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110" />
          <div
            onClick={handleLogOut}
            onMouseEnter={() => setLogicon(true)}
            onMouseLeave={() => setLogicon(false)}
          >
            <img
              src={authUser.profileImg}
              className="w-10 h-10 m-4 bg-white  rounded-full"
            />
            {logicon && (
              <RiLogoutCircleFill className="text-sky-400 w-8 h-8 -translate-y-[50px]  shadow-inner shadow-black rounded-full  translate-x-5 cursor-pointer " />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSideBar;
