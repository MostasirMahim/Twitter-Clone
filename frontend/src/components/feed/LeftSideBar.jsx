import { BsTwitterX } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function LeftSideBar() {
  const naviagte = useNavigate();
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
    <div className="hidden sm:block w-[15%] max-h-screen sticky top-0 border-r-[1px] border-gray-700">
      <div className="flex flex-col justify-between items-end h-full ">
        <div className="grid justify-items-center ">
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
          <HiOutlineMail
            onClick={() => naviagte("/conversation")}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <HiUsers
            onClick={() => naviagte("/sugessted/discover")}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <FaRegUser
            onClick={() => naviagte(`/profile/${authUser.username}`)}
            className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110"
          />
          <CgMoreO className="w-[28px] h-[28px] m-4 cursor-pointer hover:text-sky-400 hover:scale-110" />
        </div>
        <div
            onClick={() => document.getElementById("my_modal_LG").showModal()}
            className="flex justify-center items-center cursor-pointer hover:text-sky-400 duration-300  hover:scale-110"
          >
            <img
              src={authUser.profileImg}
              className="w-10 h-10 m-4 mt-11 bg-white hover:border-2 duration-200 border-sky-400 rounded-full"
            />
           
          </div>
      </div>

      <dialog id="my_modal_LG" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Log Out</h3>
          <p className="py-4 text-xl font-spartan">
            Are you sure you want to log out ?
          </p>
          <div className="modal-action">
            <button
              onClick={handleLogOut}
              className="btn btn-outline bg-red-600 text-white hover:bg-red-800"
            >
              Log Out
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default LeftSideBar;
