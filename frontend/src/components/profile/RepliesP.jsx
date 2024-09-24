/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import Tweets from "../feed/Tweets";

function RepliesP({ id }) {
  const { data: repliesposts } = useQuery({
    queryKey: ["repliesposts", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/replies/${id}`);
        const data = await res.json();
        if (!res.ok) return data.error;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  if (!repliesposts) return null;
  return (
    <div>
      {repliesposts.map((post) => (
        <div key={post._id}>
          <Tweets key={post._id} post={post} />
        </div>
      ))}
    </div>
  );
}

export default RepliesP;
