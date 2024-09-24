import { useQuery } from "@tanstack/react-query";
import Follow from "../../hooks/Follow";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../feed/LoadingSpinner";
const VALID_TABS = ["discover", "following", "followers"];

function SuggestedUser() {
  const navigate = useNavigate();
  const { ui } = useParams();
  const [activeTab, setActiveTab] = useState(ui || "discover");

  const { data: suggestedUsers } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggetion");
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { data: followingUsers } = useQuery({
    queryKey: ["followingUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/following");
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleGoToTab = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "discover":
        navigate("/sugessted/discover");
        break;
      case "following":
        navigate("/sugessted/following");
        break;
      case "followers":
        navigate("/sugessted/followers");
        break;
      default:
        navigate("/sugessted/discover");
        break;
    }
  };

  useEffect(() => {
    if (!VALID_TABS.includes(ui)) {
      navigate("/sugessted/discover");
    } else {
      setActiveTab(ui);
    }
  }, [ui, navigate]);

  if (!suggestedUsers || !followingUsers) {
    return <LoadingSpinner />;
  }
  console.log(suggestedUsers);
  return (
    <div className="xs:border-1-[1px] xs:border-gray-700 sm:border-none"> 
      <div className="flex justify-around sticky top-0  z-10 bg-black/40 backdrop-blur-lg border-b-[1px] border-gray-700 h-14 ">
        <div
          onClick={() => handleGoToTab("discover")}
          className=" w-[33%] hover:bg-gray-800 flex items-center justify-center relative"
        >
          For you
          {activeTab === "discover" && (
            <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
          )}
        </div>
        <div
          onClick={() => handleGoToTab("following")}
          className="w-[33%] hover:bg-gray-800 flex items-center justify-center relative"
        >
          Following
          {activeTab === "following" && (
            <span className="absolute bottom-0 left-auto right-auto w-20 h-1 bg-sky-400 rounded"></span>
          )}
        </div>
        <div
          onClick={() => handleGoToTab("followers")}
          className="w-[33%] hover:bg-gray-800 flex items-center justify-center relative"
        >
          Followers
          {activeTab === "followers" && (
            <span className="absolute bottom-0 left-auto right-auto w-20 h-1 bg-sky-400 rounded"></span>
          )}
        </div>
      </div>

      <div>
        {activeTab === "discover" &&
          suggestedUsers.map((user) => <Follow key={user._id} user={user} />)}
        {activeTab === "following" &&
          followingUsers.following.map((user) => (
            <Follow key={user._id} user={user} />
          ))}
        {activeTab === "followers" &&
          followingUsers.followers.map((user) => (
            <Follow key={user._id} user={user} />
          ))}
      </div>
    </div>
  );
}

export default SuggestedUser;
