import { useQuery } from "@tanstack/react-query";

function useChatPeople() {
  return useQuery({
    queryKey: ["chatPepole"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/messages/getChatPeople`);
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

export default useChatPeople;
