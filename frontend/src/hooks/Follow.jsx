/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";

function Follow({ user }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between px-4 rounded-full bg-slate-900 mx-4 items-center my-4 border-[1px] border-gray-700 ">
        <div
          className="flex cursor-pointer "
          onClick={() => navigate(`/profile/${user.username}`)}
        >
          <img
            src={user.profileImg}
            alt="profileImg"
            className="rounded-full h-[40px] w-[40px] m-2 "
          />
          <div className="flex flex-col justify-center items-start hover:text-sky-400 ">
            <h1 className="text-[15px] font-sans font-bold">{user.fullname}</h1>
            <p className="text-[13px] text-left text-gray-500">
              @{user.username}
            </p>
          </div>
        </div>

        <FollowButton user={user} />
      </div>
    </div>
  );
}

export default Follow;
