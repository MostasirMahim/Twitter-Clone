import { useQuery } from "@tanstack/react-query";

function useChatOthers() {
  return useQuery({
    queryKey: ["chatOthers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/messages/getOthers`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });
}

export default useChatOthers;
