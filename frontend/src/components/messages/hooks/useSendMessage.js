import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import messageStore from "../messageStore";

function useSendMessage() {
  const { setConversationMessage } = messageStore();

  return useMutation({
    mutationFn: async (Data) => {
      try {
        const res = await fetch(`/api/messages/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Data),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        toast.error(error.message);
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      setConversationMessage(data);
    },
  });
}

export default useSendMessage;
