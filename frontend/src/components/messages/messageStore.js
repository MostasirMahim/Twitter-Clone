import { create } from "zustand";

const messageStore = create((set) => ({
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

  conversationMessage: [],
  setConversationMessage: (message) =>
    set((state) => ({
      conversationMessage: [
        ...state.conversationMessage,
        ...(Array.isArray(message) ? message : [message]),
      ],
    })),
  clearConversationMessage: () => set({ conversationMessage: [] }),

  messageUser: "",
  setMessageUser: (messageUser) => set(() => ({ messageUser })),
}));

export default messageStore;
