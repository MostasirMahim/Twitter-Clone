import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import ProfilePage from "./components/profile/ProfilePage";
import Notification from "./components/notifications/Notification";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Post from "./components/feed/Post";
import SuggestedUser from "./components/users/SuggestedUser";
import LeftSideBar from "./components/feed/LeftSideBar";
import RightPanel from "./components/feed/RightPanel";
import HomePage from "./components/feed/HomePage";
import LoadingSpinner from "./components/feed/LoadingSpinner";
import ScrollToTop from "./components/feed/RefreshScrolling";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "res not ok");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex">
      {authUser && <LeftSideBar />}
      <div className="w-[50%] xs:w-[85%]  sm:w-[85%] md:w-[60%] lg:w-[50%]">
        <ScrollToTop />
        <Routes>
          <Route
            path="/sugessted"
            element={<Navigate to="/sugessted/discover" />}
          />
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route
            path="/:ui"
            element={authUser ? <HomePage /> : <Navigate to="/login " />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/feed" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/feed" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/notification"
            element={authUser ? <Notification /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:id"
            element={authUser ? <Post /> : <Navigate to="/login" />}
          />
          <Route
            path="/sugessted/:ui"
            element={authUser ? <SuggestedUser /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
