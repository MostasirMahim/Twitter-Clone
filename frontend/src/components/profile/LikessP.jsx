import { useQuery } from "@tanstack/react-query";
import Tweets from "../feed/Tweets";

// eslint-disable-next-line react/prop-types
function LikessP({ id }) {
  const { data: likesposts } = useQuery({
    queryKey: ["likesposts"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/likedpost/${id}`);
        const data = await res.json();
        if (!res.ok) return data.error;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  console.log(likesposts);
  if (!likesposts) return null;
  return (
    <div>
      {likesposts.map((post) => (
        <div key={post._id}>
          <Tweets key={post._id} post={post} />
        </div>
      ))}
    </div>
  );
}
export default LikessP;
