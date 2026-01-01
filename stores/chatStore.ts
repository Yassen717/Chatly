import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: string;
  updatedAt: number;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;

  // Actions
  setActiveConversation: (id: string | null) => void;
  createConversation: () => string;
  sendMessage: (text: string, conversationId?: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isLoading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      createConversation: () => {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          updatedAt: Date.now(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id,
        }));

        return newConversation.id;
      },

      sendMessage: async (text: string, conversationId?: string) => {
        const { activeConversationId, conversations } = get();
        const targetId = conversationId || activeConversationId;

        if (!targetId) {
          // Should initiate a new conversation if none exists
          const id = get().createConversation();
          // Recursive call with the new ID
          return get().sendMessage(text, id);
        }

        const userMessage: Message = {
          id: Date.now().toString(),
          text,
          sender: 'user',
          timestamp: Date.now(),
        };

        set((state) => {
          const updatedConversations = state.conversations.map((conv) => {
            if (conv.id === targetId) {
              // Generate a title from the first message if it's "New Chat"
              const newTitle = conv.messages.length === 0 ? (text.length > 30 ? text.substring(0, 30) + '...' : text) : conv.title;
              return {
                ...conv,
                messages: [...conv.messages, userMessage],
                lastMessage: text,
                updatedAt: Date.now(),
                title: newTitle
              };
            }
            return conv;
          });

          // Re-sort by updated time
          updatedConversations.sort((a, b) => b.updatedAt - a.updatedAt);

          return { conversations: updatedConversations };
        });

        // Simulate AI Response
        set({ isLoading: true });

        // Mock AI response delay
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm a simulated AI response. Eventually I'll be connected to a real API!",
            sender: 'ai',
            timestamp: Date.now(),
          };

          set((state) => {
            const updatedConversations = state.conversations.map((conv) => {
              if (conv.id === targetId) {
                return {
                  ...conv,
                  messages: [...conv.messages, aiMessage],
                  lastMessage: aiMessage.text,
                  updatedAt: Date.now(),
                };
              }
              return conv;
            });

            return {
              conversations: updatedConversations,
              isLoading: false
            };
          });
        }, 1500);
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        }));
      },

      getConversation: (id) => {
        return get().conversations.find((c) => c.id === id);
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
