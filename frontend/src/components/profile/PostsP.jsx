/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import Tweets from "../feed/Tweets";

function PostsP({ id }) {
  const { data: userposts } = useQuery({
    queryKey: ["userposts"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/myposts/${id}`);
        const data = await res.json();
        if (!res.ok) return data.error;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  if (!userposts) return null;
  return (
    <div>
      {userposts.length == 0 && (
        <p className="text-lg text-center mt-4">You Not Post Yet</p>
      )}
      {userposts.map((post) => (
        <div key={post._id}>
          <Tweets key={post._id} post={post} />
        </div>
      ))}
    </div>
  );
}

export default PostsP;
