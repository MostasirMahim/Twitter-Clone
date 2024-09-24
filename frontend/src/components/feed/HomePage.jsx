import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tweets from "./Tweets.jsx";
import CreatePostMenu from "./CreatePostMenu";
import LoadingSection from "./LoadingSection.jsx";

const VALID_TABS = ["feed", "following"];
function HomePage() {
  const navigate = useNavigate();
  const { ui } = useParams();
  const [activeTab, setActiveTab] = useState(ui || "feed");

  useEffect(() => {
    if (!VALID_TABS.includes(ui)) {
      navigate("/feed");
    } else {
      setActiveTab(ui);
    }
  }, [ui, navigate]);

  const { data: POSTS } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/posts/all");
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { data: FollowingPost } = useQuery({
    queryKey: ["followPosts"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/posts/followingpost");
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
      case "feed":
        navigate("/feed");
        break;
      case "following":
        navigate("/following");
        break;
      default:
        navigate("/feed");
        break;
    }
  };

  if (!FollowingPost || !POSTS) {
    return (
      <div className="space-y-20 mt-12">
        <LoadingSection />
        <LoadingSection />
        <LoadingSection />
      </div>
    );
  }

  return (
    <div className="flex flex-col xs:border-r-[1px] xs:border-gray-700 sm:border-none">
      <div className="flex justify-around sticky top-0  z-10 bg-black/40 backdrop-blur-lg border-b-[1px] border-gray-700 h-12 ">
        <div
          onClick={() => handleGoToTab("feed")}
          className=" w-[50%] hover:bg-gray-800 flex items-center justify-center relative"
        >
          For you
          {activeTab === "feed" && (
            <span className="absolute bottom-0 left-auto right-auto w-16 h-1 bg-sky-400 rounded"></span>
          )}
        </div>
        <div
          onClick={() => handleGoToTab("following")}
          className="w-[50%] hover:bg-gray-800 flex items-center justify-center relative"
        >
          Following
          {activeTab === "following" && (
            <span className="absolute bottom-0 left-auto right-auto w-20 h-1 bg-sky-400 rounded"></span>
          )}
        </div>
      </div>

      {POSTS.length == 0 && (
        <div className="flex justify-center mt-6">No Post Available</div>
      )}
      {activeTab === "feed" && (
        <div>
          <CreatePostMenu />
          {POSTS ? (
            POSTS.map((post) => (
              <div key={post._id}>
                <Tweets key={post._id} post={post} />
              </div>
            ))
          ) : (
            <LoadingSection />
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div>
          {FollowingPost.length == 0 && (
            <div className="flex justify-center mt-6">No Post Available</div>
          )}
          {FollowingPost.map((post) => (
            <div key={post._id}>
              <Tweets key={post._id} post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
