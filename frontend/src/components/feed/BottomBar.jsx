import { GoHomeFill } from "react-icons/go";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function BottomBar() {
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
    <div className="w-full h-12 flex justify-center items-center  border-t-[1px] border-gray-700">
      <div className="w-full flex justify-around items-center gap-1 px-4">
        <GoHomeFill
          onClick={() => naviagte("/feed")}
          className="w-[28px] h-[28px]  cursor-pointer hover:text-sky-400 hover:scale-110"
        />
        <IoNotificationsOutline
          onClick={() => naviagte("/notification")}
          className="w-[28px] h-[28px] cursor-pointer hover:text-sky-400 hover:scale-110"
        />

        <HiOutlineMail
          onClick={() => naviagte("/conversation")}
          className="w-[28px] h-[28px] cursor-pointer hover:text-sky-400 hover:scale-110"
        />
        <HiUsers
          onClick={() => naviagte("/sugessted/discover")}
          className="w-[28px] h-[28px] cursor-pointer hover:text-sky-400 hover:scale-110"
        />
        <FaRegUser
          onClick={() => naviagte(`/profile/${authUser.username}`)}
          className="w-[25px] h-[25px] cursor-pointer hover:text-sky-400 hover:scale-110"
        />
        <CgMoreO
          onClick={() => document.getElementById("my_modal_LG").showModal()}
          className="w-[25px] h-[25px] cursor-pointer hover:text-sky-400 hover:scale-110"
        />
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

export default BottomBar;
