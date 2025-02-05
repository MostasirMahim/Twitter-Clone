import { useQuery } from "@tanstack/react-query";

function useConversation(id) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/messages/getConversation/${id}`);
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
    enabled: !!id,
  });
}

export default useConversation;
