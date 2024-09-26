/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function FollowButton({ user }) {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: followButton,isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/follow/${user._id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["suggestedUser"] });
      queryClient.invalidateQueries({ queryKey: ["followingUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      // Handle error cases
      toast.error("Something went wrong: " + error.message);
    },
  });

  const isFollowed = authUser.following.includes(user._id);
  const handleFollow = () => {
    followButton();
  };
  return (
    <div>
      <button
        onClick={handleFollow}
        type="button"
        className=" w-20 mb-1 h-8 bg-white text-black rounded-full font-semibold ml-4 text-blackp-0.5  hover:bg-sky-500 hover:text-white"
      >
        {isPending?"Following" : (isFollowed ? "Unfollow" : "Follow")}
      </button>
    </div>
  );
}

export default FollowButton;
